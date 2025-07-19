package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entity.Order;
import org.apache.ibatis.annotations.*;
import java.util.List;

import java.time.LocalDateTime;

/**
 * 订单Mapper接口
 */
@Mapper
public interface OrderMapper {

    /**
     * 分页查询用户订单
     */
    @Select("<script>" +
            "SELECT o.*, u.username FROM orders o " +
            "LEFT JOIN user u ON o.user_id = u.id " +
            "WHERE o.user_id = #{userId} AND o.is_deleted = 0 " +
            "<if test='query.orderNumber != null and query.orderNumber != \"\"'>" +
            "AND o.order_number LIKE CONCAT('%', #{query.orderNumber}, '%') " +
            "</if>" +
            "<if test='query.status != null'>" +
            "AND o.status = #{query.status} " +
            "</if>" +
            "<if test='query.startDate != null'>" +
            "AND o.created_at &gt;= #{query.startDate} " +
            "</if>" +
            "<if test='query.endDate != null'>" +
            "AND o.created_at &lt;= #{query.endDate} " +
            "</if>" +
            "ORDER BY " +
            "<choose>" +
            "<when test='query.sortBy == \"total_amount\"'>o.total_amount</when>" +
            "<when test='query.sortBy == \"status\"'>o.status</when>" +
            "<otherwise>o.created_at</otherwise>" +
            "</choose> " +
            "<choose>" +
            "<when test='query.sortOrder == \"asc\"'>ASC</when>" +
            "<otherwise>DESC</otherwise>" +
            "</choose> " +
            "LIMIT #{offset}, #{limit}" +
            "</script>")
    List<OrderDTO.OrderListResponse> findUserOrders(@Param("userId") Long userId, @Param("query") OrderDTO.OrderQuery query, @Param("offset") int offset, @Param("limit") int limit);

    /**
     * 分页查询所有订单（管理员用）
     */
    @Select("<script>" +
            "SELECT o.*, u.username FROM orders o " +
            "LEFT JOIN user u ON o.user_id = u.id " +
            "WHERE o.is_deleted = 0 " +
            "<if test='query.orderNumber != null and query.orderNumber != \"\"'>" +
            "AND o.order_number LIKE CONCAT('%', #{query.orderNumber}, '%') " +
            "</if>" +
            "<if test='query.status != null'>" +
            "AND o.status = #{query.status} " +
            "</if>" +
            "<if test='query.startDate != null'>" +
            "AND o.created_at &gt;= #{query.startDate} " +
            "</if>" +
            "<if test='query.endDate != null'>" +
            "AND o.created_at &lt;= #{query.endDate} " +
            "</if>" +
            "ORDER BY " +
            "<choose>" +
            "<when test='query.sortBy == \"total_amount\"'>o.total_amount</when>" +
            "<when test='query.sortBy == \"status\"'>o.status</when>" +
            "<otherwise>o.created_at</otherwise>" +
            "</choose> " +
            "<choose>" +
            "<when test='query.sortOrder == \"asc\"'>ASC</when>" +
            "<otherwise>DESC</otherwise>" +
            "</choose> " +
            "LIMIT #{offset}, #{limit}" +
            "</script>")
    List<OrderDTO.OrderListResponse> findAllOrders(@Param("query") OrderDTO.OrderQuery query, @Param("offset") int offset, @Param("limit") int limit);

    /**
     * 根据订单号查询订单
     */
    @Select("SELECT * FROM orders WHERE order_number = #{orderNumber} AND is_deleted = 0")
    Order findByOrderNumber(@Param("orderNumber") String orderNumber);

    /**
     * 获取订单统计信息
     */
    @Select("SELECT " +
            "COUNT(*) as total_orders, " +
            "SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as pending_payment, " +
            "SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as paid, " +
            "SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) as shipped, " +
            "SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) as completed, " +
            "SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END) as cancelled, " +
            "SUM(CASE WHEN status IN (2,3,4) THEN total_amount ELSE 0 END) as total_amount " +
            "FROM orders WHERE is_deleted = 0 " +
            "<if test='startDate != null'>AND created_at &gt;= #{startDate} </if>" +
            "<if test='endDate != null'>AND created_at &lt;= #{endDate} </if>")
    OrderDTO.OrderStatistics getOrderStatistics(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * 插入订单
     */
    @Insert("INSERT INTO orders (order_number, user_id, total_amount, status, address_id, receiver_name, receiver_phone, receiver_address, remarks, created_at, updated_at, is_deleted) " +
            "VALUES (#{orderNumber}, #{userId}, #{totalAmount}, #{status}, #{addressId}, #{receiverName}, #{receiverPhone}, #{receiverAddress}, #{remarks}, NOW(), NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Order order);

    /**
     * 根据ID查询订单
     */
    @Select("SELECT * FROM orders WHERE id = #{id} AND is_deleted = 0")
    Order selectById(@Param("id") Long id);

    /**
     * 根据ID更新订单
     */
    @Update("UPDATE orders SET order_number = #{orderNumber}, user_id = #{userId}, total_amount = #{totalAmount}, " +
            "status = #{status}, address_id = #{addressId}, receiver_name = #{receiverName}, receiver_phone = #{receiverPhone}, " +
            "receiver_address = #{receiverAddress}, remarks = #{remarks}, updated_at = NOW() WHERE id = #{id} AND is_deleted = 0")
    int updateById(Order order);

    /**
     * 根据ID删除订单（逻辑删除）
     */
    @Update("UPDATE orders SET is_deleted = 1, updated_at = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    /**
     * 统计用户订单数量
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM orders WHERE user_id = #{userId} AND is_deleted = 0 " +
            "<if test='query.orderNumber != null and query.orderNumber != \"\"'>" +
            "AND order_number LIKE CONCAT('%', #{query.orderNumber}, '%') " +
            "</if>" +
            "<if test='query.status != null'>" +
            "AND status = #{query.status} " +
            "</if>" +
            "<if test='query.startDate != null'>" +
            "AND created_at &gt;= #{query.startDate} " +
            "</if>" +
            "<if test='query.endDate != null'>" +
            "AND created_at &lt;= #{query.endDate} " +
            "</if>" +
            "</script>")
    long countUserOrders(@Param("userId") Long userId, @Param("query") OrderDTO.OrderQuery query);

    /**
     * 统计所有订单数量
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM orders WHERE is_deleted = 0 " +
            "<if test='query.orderNumber != null and query.orderNumber != &quot;&quot;'>" +
            "AND order_number LIKE CONCAT('%', #{query.orderNumber}, '%') " +
            "</if>" +
            "<if test='query.status != null'>" +
            "AND status = #{query.status} " +
            "</if>" +
            "<if test='query.startDate != null'>" +
            "AND created_at &gt;= #{query.startDate} " +
            "</if>" +
            "<if test='query.endDate != null'>" +
            "AND created_at &lt;= #{query.endDate} " +
            "</if>" +
            "</script>")
    long countAllOrders(@Param("query") OrderDTO.OrderQuery query);
}