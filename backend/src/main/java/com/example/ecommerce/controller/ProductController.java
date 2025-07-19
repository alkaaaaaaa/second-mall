package com.example.ecommerce.controller;

import com.example.ecommerce.common.Result;
import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Result<ProductDTO.PageResponse<ProductDTO.ProductListResponse>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String name) {
        
        log.info("获取商品列表请求 - 页码: {}, 大小: {}, 分类: {}", page, size, categoryId);
        
        try {
            ProductDTO.ProductQuery query = new ProductDTO.ProductQuery();
            query.setPage(page);
            query.setSize(size);
            query.setCategoryId(categoryId);
            query.setName(name);
            
            ProductDTO.PageResponse<ProductDTO.ProductListResponse> response = productService.getProductList(query);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取商品列表失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<ProductDTO.ProductResponse> getProductById(@PathVariable Long id) {
        log.info("获取商品详情请求 - ID: {}", id);
        try {
            ProductDTO.ProductResponse response = productService.getProductDetail(id);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取商品详情失败: {}", e.getMessage());
            return Result.error(404, "商品不存在");
        }
    }

    @GetMapping("/featured")
    public Result<ProductDTO.PageResponse<ProductDTO.ProductListResponse>> getFeaturedProducts(
            @RequestParam(defaultValue = "8") int limit) {
        log.info("获取热销商品请求 - 限制数量: {}", limit);
        try {
            ProductDTO.ProductQuery query = new ProductDTO.ProductQuery();
            query.setPage(1);
            query.setSize(limit);
            query.setSortBy("sales_count");
            query.setSortOrder("desc");
            
            ProductDTO.PageResponse<ProductDTO.ProductListResponse> response = productService.getProductList(query);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取热销商品失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }
} 