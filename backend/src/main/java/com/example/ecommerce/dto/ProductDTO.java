package com.example.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 商品DTO类
 */
public class ProductDTO {

    /**
     * 商品创建/更新DTO
     */
    @Data
    public static class ProductRequest {
        @NotBlank(message = "商品名称不能为空")
        @Size(max = 100, message = "商品名称长度不能超过100字符")
        private String name;

        @Size(max = 500, message = "商品描述长度不能超过500字符")
        private String description;

        @NotNull(message = "分类ID不能为空")
        private Long categoryId;

        @NotNull(message = "商品价格不能为空")
        @DecimalMin(value = "0.01", message = "商品价格必须大于0")
        @Digits(integer = 8, fraction = 2, message = "价格格式不正确")
        private BigDecimal price;

        @NotNull(message = "库存数量不能为空")
        @Min(value = 0, message = "库存数量不能为负数")
        private Integer stock;

        private String mainImage;

        private Integer status = 1; // 默认上架
    }

    /**
     * 商品查询条件DTO
     */
    @Data
    public static class ProductQuery {
        private String name; // 商品名称模糊查询
        private Long categoryId; // 分类ID
        private BigDecimal minPrice; // 最低价格
        private BigDecimal maxPrice; // 最高价格
        private Integer status; // 商品状态
        private String sortBy = "created_at"; // 排序字段
        private String sortOrder = "desc"; // 排序方向
        private Integer page = 1; // 页码
        private Integer size = 20; // 每页大小
    }

    /**
     * 商品详情响应DTO
     */
    @Data
    public static class ProductResponse {
        private Long id;
        private String name;
        private String description;
        private Long categoryId;
        private String categoryName;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stock;
        private String mainImage;
        private List<String> images; // 商品图片列表
        private String brand;
        private Integer status;
        private Integer salesCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    /**
     * 商品列表响应DTO
     */
    @Data
    public static class ProductListResponse {
        private Long id;
        private String name;
        private String description;
        private Long categoryId;
        private String categoryName;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stock;
        private String mainImage;
        private String brand;
        private Integer status;
        private Integer salesCount;
    }

    /**
     * 分页查询响应DTO
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