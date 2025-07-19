package com.example.ecommerce.service.impl;


import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.mapper.OrderItemMapper;
import com.example.ecommerce.mapper.OrderMapper;
import com.example.ecommerce.mapper.ProductMapper;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 订单服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final ProductMapper productMapper;
    private final ProductService productService;

    @Override
    @Transactional
    public Long createOrder(Long userId, OrderDTO.CreateOrderRequest request) {
        // 1. 验证商品信息并计算总金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderDTO.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productMapper.selectById(itemRequest.getProductId());
            if (product == null || product.getStatus() != 1) {
                throw new RuntimeException("商品不存在或已下架：" + itemRequest.getProductId());
            }
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("商品库存不足：" + product.getName());
            }
            
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // 2. 生成订单号
        String orderNumber = generateOrderNumber();

        // 3. 创建订单
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus(1); // 待支付
        order.setAddressId(request.getAddressId());
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setReceiverAddress(request.getReceiverAddress());
        order.setRemarks(request.getRemarks());

        int result = orderMapper.insert(order);
        if (result <= 0) {
            throw new RuntimeException("订单创建失败");
        }

        // 4. 创建订单项并减库存
        for (OrderDTO.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productMapper.selectById(itemRequest.getProductId());
            
            // 减少库存
            boolean stockDecreased = productService.decreaseStock(itemRequest.getProductId(), itemRequest.getQuantity());
            if (!stockDecreased) {
                throw new RuntimeException("库存扣减失败：" + product.getName());
            }

            // 创建订单项
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(itemRequest.getProductId());
            orderItem.setProductName(product.getName());
            orderItem.setProductPrice(product.getPrice());
            orderItem.setProductImage(product.getMainImage());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            orderItemMapper.insert(orderItem);
        }

        log.info("订单创建成功，订单ID：{}，订单号：{}", order.getId(), orderNumber);
        return order.getId();
    }

    @Override
    public OrderDTO.OrderResponse getOrderDetail(Long orderId, Long userId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        // 检查订单所有权（非管理员需要验证）
        if (userId != null && !order.getUserId().equals(userId)) {
            throw new RuntimeException("无权限查看此订单");
        }

        // 查询订单项
        List<OrderDTO.OrderItemResponse> orderItems = orderItemMapper.findOrderItemsByOrderId(orderId);

        OrderDTO.OrderResponse response = new OrderDTO.OrderResponse();
        BeanUtils.copyProperties(order, response);
        response.setStatusName(getOrderStatusName(order.getStatus()));
        response.setOrderItems(orderItems);

        return response;
    }

    @Override
    public OrderDTO.PageResponse<OrderDTO.OrderListResponse> getUserOrders(Long userId, OrderDTO.OrderQuery query) {
        // 计算分页参数
        int page = query.getPage() != null ? query.getPage() : 1;
        int size = query.getSize() != null ? query.getSize() : 10;
        int offset = (page - 1) * size;

        // 查询用户订单
        List<OrderDTO.OrderListResponse> records = orderMapper.findUserOrders(userId, query, offset, size);
        
        // 查询总数
        long total = orderMapper.countUserOrders(userId, query);
        
        // 计算总页数
        int pages = (int) Math.ceil((double) total / size);

        // 构建响应
        OrderDTO.PageResponse<OrderDTO.OrderListResponse> response = new OrderDTO.PageResponse<>();
        response.setRecords(records);
        response.setTotal(total);
        response.setPage(page);
        response.setSize(size);
        response.setPages(pages);

        return response;
    }

    @Override
    public OrderDTO.PageResponse<OrderDTO.OrderListResponse> getAllOrders(OrderDTO.OrderQuery query) {
        // 计算分页参数
        int page = query.getPage() != null ? query.getPage() : 1;
        int size = query.getSize() != null ? query.getSize() : 10;
        int offset = (page - 1) * size;

        // 查询所有订单
        List<OrderDTO.OrderListResponse> records = orderMapper.findAllOrders(query, offset, size);
        
        // 查询总数
        long total = orderMapper.countAllOrders(query);
        
        // 计算总页数
        int pages = (int) Math.ceil((double) total / size);

        // 构建响应
        OrderDTO.PageResponse<OrderDTO.OrderListResponse> response = new OrderDTO.PageResponse<>();
        response.setRecords(records);
        response.setTotal(total);
        response.setPage(page);
        response.setSize(size);
        response.setPages(pages);

        return response;
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, OrderDTO.UpdateOrderStatusRequest request) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        // 验证状态转换是否合法
        validateStatusTransition(order.getStatus(), request.getStatus());

        // 更新订单状态
        order.setStatus(request.getStatus());
        if (request.getRemarks() != null) {
            order.setRemarks(request.getRemarks());
        }

        int result = orderMapper.updateById(order);
        if (result <= 0) {
            throw new RuntimeException("订单状态更新失败");
        }

        log.info("订单状态更新成功，订单ID：{}，新状态：{}", orderId, request.getStatus());
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        // 检查订单所有权
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权限操作此订单");
        }

        // 只有待支付和已支付的订单可以取消
        if (order.getStatus() != 1 && order.getStatus() != 2) {
            throw new RuntimeException("当前订单状态不允许取消");
        }

        // 恢复库存
        List<OrderItem> orderItems = orderItemMapper.findByOrderId(orderId);
        for (OrderItem item : orderItems) {
            productService.increaseStock(item.getProductId(), item.getQuantity());
        }

        // 更新订单状态为已取消
        order.setStatus(5);
        orderMapper.updateById(order);

        log.info("订单取消成功，订单ID：{}", orderId);
    }

    @Override
    @Transactional
    public void confirmOrder(Long orderId, Long userId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        // 检查订单所有权
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权限操作此订单");
        }

        // 只有已发货的订单可以确认收货
        if (order.getStatus() != 3) {
            throw new RuntimeException("当前订单状态不允许确认收货");
        }

        // 更新销量
        List<OrderItem> orderItems = orderItemMapper.findByOrderId(orderId);
        for (OrderItem item : orderItems) {
            productService.updateSalesCount(item.getProductId(), item.getQuantity());
        }

        // 更新订单状态为已完成
        order.setStatus(4);
        orderMapper.updateById(order);

        log.info("订单确认收货成功，订单ID：{}", orderId);
    }

    @Override
    public OrderDTO.OrderStatistics getOrderStatistics() {
        return orderMapper.getOrderStatistics(null, null);
    }

    /**
     * 生成订单号
     */
    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
        return "ORDER" + timestamp + random;
    }

    /**
     * 获取订单状态名称
     */
    private String getOrderStatusName(Integer status) {
        switch (status) {
            case 1: return "待支付";
            case 2: return "已支付";
            case 3: return "已发货";
            case 4: return "已完成";
            case 5: return "已取消";
            default: return "未知状态";
        }
    }

    /**
     * 验证订单状态转换是否合法
     */
    private void validateStatusTransition(Integer currentStatus, Integer newStatus) {
        // 定义合法的状态转换
        boolean isValid = false;
        
        switch (currentStatus) {
            case 1: // 待支付
                isValid = (newStatus == 2 || newStatus == 5); // 可以支付或取消
                break;
            case 2: // 已支付
                isValid = (newStatus == 3 || newStatus == 5); // 可以发货或取消
                break;
            case 3: // 已发货
                isValid = (newStatus == 4); // 只能确认收货
                break;
            case 4: // 已完成
            case 5: // 已取消
                isValid = false; // 终态，不能再转换
                break;
        }

        if (!isValid) {
            throw new RuntimeException("不合法的订单状态转换：" + currentStatus + " -> " + newStatus);
        }
    }
}
