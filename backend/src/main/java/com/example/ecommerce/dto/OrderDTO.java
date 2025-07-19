package com.example.ecommerce.dto;

import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单DTO类
 */
public class OrderDTO {

    /**
     * 订单创建DTO
     */
    @Data
    public static class CreateOrderRequest {
        @NotNull(message = "收货地址ID不能为空")
        private Long addressId;

        @NotBlank(message = "收货人姓名不能为空")
        private String receiverName;

        @NotBlank(message = "收货人电话不能为空")
        private String receiverPhone;

        @NotBlank(message = "收货地址不能为空")
        private String receiverAddress;

        private String remarks;

        @NotEmpty(message = "订单项不能为空")
        private List<OrderItemRequest> orderItems;
    }

    /**
     * 订单项DTO
     */
    @Data
    public static class OrderItemRequest {
        @NotNull(message = "商品ID不能为空")
        private Long productId;

        @NotNull(message = "购买数量不能为空")
        @Min(value = 1, message = "购买数量必须大于0")
        private Integer quantity;
    }

    /**
     * 订单查询条件DTO
     */
    @Data
    public static class OrderQuery {
        private String orderNumber; // 订单号
        private Integer status; // 订单状态
        private LocalDateTime startDate; // 开始日期
        private LocalDateTime endDate; // 结束日期
        private String sortBy = "created_at"; // 排序字段
        private String sortOrder = "desc"; // 排序方向
        private Integer page = 1; // 页码
        private Integer size = 20; // 每页大小
    }

    /**
     * 订单响应DTO
     */
    @Data
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private Long userId;
        private String username;
        private BigDecimal totalAmount;
        private Integer status;
        private String statusName;
        private Long addressId;
        private String receiverName;
        private String receiverPhone;
        private String receiverAddress;
        private String remarks;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OrderItemResponse> orderItems;
    }

    /**
     * 订单项响应DTO
     */
    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long orderId;
        private Long productId;
        private String productName;
        private BigDecimal productPrice;
        private String productImage;
        private Integer quantity;
        private BigDecimal subtotal;
    }

    /**
     * 订单列表响应DTO（简化版）
     */
    @Data
    public static class OrderListResponse {
        private Long id;
        private String orderNumber;
        private BigDecimal totalAmount;
        private Integer status;
        private String statusName;
        private String receiverName;
        private LocalDateTime createdAt;
    }

    /**
     * 订单状态更新DTO
     */
    @Data
    public static class UpdateOrderStatusRequest {
        @NotNull(message = "订单状态不能为空")
        private Integer status;
        
        private String remarks;
    }

    /**
     * 订单统计DTO
     */
    @Data
    public static class OrderStatistics {
        private Long totalOrders; // 总订单数
        private Long pendingPayment; // 待支付订单数
        private Long paid; // 已支付订单数
        private Long shipped; // 已发货订单数
        private Long completed; // 已完成订单数
        private Long cancelled; // 已取消订单数
        private BigDecimal totalAmount; // 总交易金额
    }

    /**
     * 分页响应DTO
     */
    @Data
    public static class PageResponse<T> {
        private List<T> records;
        private Long total;
        private Integer page;
        private Integer size;
        private Integer pages;
    }
} 