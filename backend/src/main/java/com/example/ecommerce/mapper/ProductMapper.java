package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Product;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 商品Mapper接口
 */
@Mapper
public interface ProductMapper {

    /**
     * 分页查询商品（带分类名称）
     */
    @Select("<script>" +
            "SELECT p.id, p.name, p.description, p.category_id, c.name as category_name, " +
            "p.price, p.original_price, p.stock, p.main_image, p.brand, p.status, p.sales_count FROM product p " +
            "LEFT JOIN category c ON p.category_id = c.id " +
            "WHERE p.is_deleted = 0 " +
            "<if test='query.name != null and query.name != &quot;&quot;'>" +
            "AND p.name LIKE CONCAT('%', #{query.name}, '%') " +
            "</if>" +
            "<if test='query.categoryId != null'>" +
            "AND p.category_id = #{query.categoryId} " +
            "</if>" +
            "<if test='query.status != null'>" +
            "AND p.status = #{query.status} " +
            "</if>" +
            "<if test='query.minPrice != null'>" +
            "AND p.price &gt;= #{query.minPrice} " +
            "</if>" +
            "<if test='query.maxPrice != null'>" +
            "AND p.price &lt;= #{query.maxPrice} " +
            "</if>" +
            "ORDER BY " +
            "<choose>" +
            "<when test='query.sortBy == \"price\"'>p.price</when>" +
            "<when test='query.sortBy == \"sales_count\"'>p.sales_count</when>" +
            "<otherwise>p.created_at</otherwise>" +
            "</choose> " +
            "<choose>" +
            "<when test='query.sortOrder == \"asc\"'>ASC</when>" +
            "<otherwise>DESC</otherwise>" +
            "</choose> " +
            "LIMIT #{offset}, #{limit}" +
            "</script>")
    List<ProductDTO.ProductListResponse> findProductsWithCategory(@Param("query") ProductDTO.ProductQuery query, @Param("offset") int offset, @Param("limit") int limit);

    /**
     * 根据ID查询商品详情（带分类名称）
     */
    @Select("SELECT p.id, p.name, p.description, p.category_id, c.name as category_name, " +
            "p.price, p.original_price, p.stock, p.main_image, p.brand, p.status, " +
            "p.sales_count, p.created_at, p.updated_at FROM product p " +
            "LEFT JOIN category c ON p.category_id = c.id " +
            "WHERE p.id = #{id} AND p.is_deleted = 0")
    ProductDTO.ProductResponse findProductDetailById(@Param("id") Long id);

    /**
     * 更新商品销量
     */
    @Update("UPDATE product SET sales_count = sales_count + #{quantity} WHERE id = #{productId}")
    int updateSalesCount(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * 减少商品库存
     */
    @Update("UPDATE product SET stock = stock - #{quantity} WHERE id = #{productId} AND stock >= #{quantity}")
    int decreaseStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * 增加商品库存
     */
    @Update("UPDATE product SET stock = stock + #{quantity} WHERE id = #{productId}")
    int increaseStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    /**
     * 插入商品
     */
    @Insert("INSERT INTO product (name, description, category_id, price, stock, main_image, status, sales_count, created_at, updated_at, is_deleted) " +
            "VALUES (#{name}, #{description}, #{categoryId}, #{price}, #{stock}, #{mainImage}, #{status}, #{salesCount}, NOW(), NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Product product);

    /**
     * 根据ID查询商品
     */
    @Select("SELECT * FROM product WHERE id = #{id} AND is_deleted = 0")
    Product selectById(@Param("id") Long id);

    /**
     * 根据ID更新商品
     */
    @Update("UPDATE product SET name = #{name}, description = #{description}, category_id = #{categoryId}, " +
            "price = #{price}, stock = #{stock}, main_image = #{mainImage}, status = #{status}, " +
            "sales_count = #{salesCount}, updated_at = NOW() WHERE id = #{id} AND is_deleted = 0")
    int updateById(Product product);

    /**
     * 根据ID删除商品（逻辑删除）
     */
    @Update("UPDATE product SET is_deleted = 1, updated_at = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    /**
     * 查询商品总数（用于分页）
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM product p WHERE p.is_deleted = 0 " +
            "<if test='query.name != null and query.name != &quot;&quot;'>" +
            "AND p.name LIKE CONCAT('%', #{query.name}, '%') " +
            "</if>" +
            "<if test='query.categoryId != null'>" +
            "AND p.category_id = #{query.categoryId} " +
            "</if>" +
            "<if test='query.status != null'>" +
            "AND p.status = #{query.status} " +
            "</if>" +
            "<if test='query.minPrice != null'>" +
            "AND p.price &gt;= #{query.minPrice} " +
            "</if>" +
            "<if test='query.maxPrice != null'>" +
            "AND p.price &lt;= #{query.maxPrice} " +
            "</if>" +
            "</script>")
    long countProducts(@Param("query") ProductDTO.ProductQuery query);
}