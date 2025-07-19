package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;

/**
 * 订单服务接口
 */
public interface OrderService {

    /**
     * 创建订单
     */
    Long createOrder(Long userId, OrderDTO.CreateOrderRequest request);

    /**
     * 获取订单详情
     */
    OrderDTO.OrderResponse getOrderDetail(Long orderId, Long userId);

    /**
     * 分页查询用户订单
     */
    OrderDTO.PageResponse<OrderDTO.OrderListResponse> getUserOrders(Long userId, OrderDTO.OrderQuery query);

    /**
     * 分页查询所有订单（管理员）
     */
    OrderDTO.PageResponse<OrderDTO.OrderListResponse> getAllOrders(OrderDTO.OrderQuery query);

    /**
     * 更新订单状态
     */
    void updateOrderStatus(Long orderId, OrderDTO.UpdateOrderStatusRequest request);

    /**
     * 取消订单
     */
    void cancelOrder(Long orderId, Long userId);

    /**
     * 确认收货
     */
    void confirmOrder(Long orderId, Long userId);

    /**
     * 获取订单统计信息
     */
    OrderDTO.OrderStatistics getOrderStatistics();
} 