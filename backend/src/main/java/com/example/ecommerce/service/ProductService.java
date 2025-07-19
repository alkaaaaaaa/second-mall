package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDTO;

/**
 * 商品服务接口
 */
public interface ProductService {

    /**
     * 创建商品
     */
    Long createProduct(ProductDTO.ProductRequest request);

    /**
     * 更新商品
     */
    void updateProduct(Long productId, ProductDTO.ProductRequest request);

    /**
     * 删除商品
     */
    void deleteProduct(Long productId);

    /**
     * 获取商品详情
     */
    ProductDTO.ProductResponse getProductDetail(Long productId);

    /**
     * 分页查询商品列表
     */
    ProductDTO.PageResponse<ProductDTO.ProductListResponse> getProductList(ProductDTO.ProductQuery query);

    /**
     * 更新商品状态（上架/下架）
     */
    void updateProductStatus(Long productId, Integer status);

    /**
     * 减少库存
     */
    boolean decreaseStock(Long productId, Integer quantity);

    /**
     * 增加库存
     */
    void increaseStock(Long productId, Integer quantity);

    /**
     * 更新销量
     */
    void updateSalesCount(Long productId, Integer quantity);
} 