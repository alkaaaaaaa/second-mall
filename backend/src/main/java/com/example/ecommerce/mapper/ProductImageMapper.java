package com.example.ecommerce.mapper;

import com.example.ecommerce.entity.ProductImage;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 商品图片Mapper接口
 */
@Mapper
public interface ProductImageMapper {

    /**
     * 根据商品ID查询图片列表
     */
    @Select("SELECT * FROM product_image WHERE product_id = #{productId} AND is_deleted = 0 ORDER BY sort_order ASC")
    List<ProductImage> findByProductId(@Param("productId") Long productId);

    /**
     * 插入商品图片
     */
    @Insert("INSERT INTO product_image (product_id, image_url, sort_order, is_deleted, created_at, updated_at) " +
            "VALUES (#{productId}, #{imageUrl}, #{sortOrder}, 0, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ProductImage productImage);

    /**
     * 批量插入商品图片
     */
    @Insert("<script>" +
            "INSERT INTO product_image (product_id, image_url, sort_order, is_deleted, created_at, updated_at) VALUES " +
            "<foreach collection='images' item='image' separator=','>" +
            "(#{image.productId}, #{image.imageUrl}, #{image.sortOrder}, 0, NOW(), NOW())" +
            "</foreach>" +
            "</script>")
    int batchInsert(@Param("images") List<ProductImage> images);

    /**
     * 根据商品ID删除图片（逻辑删除）
     */
    @Update("UPDATE product_image SET is_deleted = 1, updated_at = NOW() WHERE product_id = #{productId}")
    int deleteByProductId(@Param("productId") Long productId);

    /**
     * 根据ID删除图片（逻辑删除）
     */
    @Update("UPDATE product_image SET is_deleted = 1, updated_at = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
