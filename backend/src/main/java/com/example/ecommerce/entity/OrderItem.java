package com.example.ecommerce.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单项实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)

public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 订单项ID
     */

    private Long id;

    /**
     * 订单ID
     */

    private Long orderId;

    /**
     * 商品ID
     */

    private Long productId;

    /**
     * 商品名称（下单时的快照）
     */

    private String productName;

    /**
     * 商品单价（下单时的快照）
     */

    private BigDecimal productPrice;

    /**
     * 商品图片（下单时的快照）
     */

    private String productImage;

    /**
     * 购买数量
     */

    private Integer quantity;

    /**
     * 小计金额
     */

    private BigDecimal subtotal;

    /**
     * 创建时间
     */

    private LocalDateTime createdAt;

    /**
     * 更新时间
     */

    private LocalDateTime updatedAt;

    /**
     * 逻辑删除标记：0-未删除，1-已删除
     */

    private Integer isDeleted;
} 