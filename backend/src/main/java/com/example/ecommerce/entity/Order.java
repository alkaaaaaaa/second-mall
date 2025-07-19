package com.example.ecommerce.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)

public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 订单ID
     */

    private Long id;

    /**
     * 订单号
     */

    private String orderNumber;

    /**
     * 用户ID
     */

    private Long userId;

    /**
     * 订单总金额
     */

    private BigDecimal totalAmount;

    /**
     * 订单状态：1-待支付，2-已支付，3-已发货，4-已完成，5-已取消
     */

    private Integer status;

    /**
     * 收货地址ID
     */

    private Long addressId;

    /**
     * 收货人姓名
     */

    private String receiverName;

    /**
     * 收货人电话
     */

    private String receiverPhone;

    /**
     * 收货地址
     */

    private String receiverAddress;

    /**
     * 订单备注
     */

    private String remarks;

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