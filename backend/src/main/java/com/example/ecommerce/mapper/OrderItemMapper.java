package com.example.ecommerce.mapper;


import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entity.OrderItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 订单项Mapper接口
 */
@Mapper
public interface OrderItemMapper {

    /**
     * 根据订单ID查询订单项
     */
    @Select("SELECT * FROM order_item WHERE order_id = #{orderId} AND is_deleted = 0")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);

    /**
     * 根据订单ID查询订单项详情（用于响应）
     */
    @Select("SELECT " +
            "oi.id, oi.order_id, oi.product_id, oi.product_name, " +
            "oi.product_price, oi.product_image, oi.quantity, oi.subtotal " +
            "FROM order_item oi " +
            "WHERE oi.order_id = #{orderId} AND oi.is_deleted = 0")
    List<OrderDTO.OrderItemResponse> findOrderItemsByOrderId(@Param("orderId") Long orderId);

    /**
     * 根据订单ID列表批量查询订单项
     */
    @Select("<script>" +
            "SELECT * FROM order_item WHERE order_id IN " +
            "<foreach collection='orderIds' item='orderId' open='(' separator=',' close=')'>" +
            "#{orderId}" +
            "</foreach>" +
            " AND is_deleted = 0" +
            "</script>")
    List<OrderItem> findByOrderIds(@Param("orderIds") List<Long> orderIds);

    /**
     * 插入订单项
     */
    @Insert("INSERT INTO order_item (order_id, product_id, product_name, product_price, product_image, quantity, subtotal, created_at, updated_at, is_deleted) " +
            "VALUES (#{orderId}, #{productId}, #{productName}, #{productPrice}, #{productImage}, #{quantity}, #{subtotal}, NOW(), NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(OrderItem orderItem);

    /**
     * 根据ID查询订单项
     */
    @Select("SELECT * FROM order_item WHERE id = #{id} AND is_deleted = 0")
    OrderItem selectById(@Param("id") Long id);

    /**
     * 根据ID更新订单项
     */
    @Update("UPDATE order_item SET order_id = #{orderId}, product_id = #{productId}, product_name = #{productName}, " +
            "product_price = #{productPrice}, product_image = #{productImage}, quantity = #{quantity}, " +
            "subtotal = #{subtotal}, updated_at = NOW() WHERE id = #{id} AND is_deleted = 0")
    int updateById(OrderItem orderItem);

    /**
     * 根据ID删除订单项（逻辑删除）
     */
    @Update("UPDATE order_item SET is_deleted = 1, updated_at = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    /**
     * 批量插入订单项
     */
    @Insert("<script>" +
            "INSERT INTO order_item (order_id, product_id, product_name, product_price, product_image, quantity, subtotal, created_at, updated_at, is_deleted) VALUES " +
            "<foreach collection='orderItems' item='item' separator=','>" +
            "(#{item.orderId}, #{item.productId}, #{item.productName}, #{item.productPrice}, #{item.productImage}, #{item.quantity}, #{item.subtotal}, NOW(), NOW(), 0)" +
            "</foreach>" +
            "</script>")
    int batchInsert(@Param("orderItems") List<OrderItem> orderItems);
} 