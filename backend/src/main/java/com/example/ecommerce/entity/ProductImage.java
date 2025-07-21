package com.example.ecommerce.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 商品图片实体类
 */
@Data
public class ProductImage {
    private Long id;
    private Long productId;
    private String imageUrl;
    private Integer sortOrder;
    private Integer isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
