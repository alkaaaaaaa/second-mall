package com.example.ecommerce.controller;

import com.example.ecommerce.common.Result;
import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
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
    
    /**
     * 管理员接口：创建商品
     */
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Long> createProduct(@Valid @RequestBody ProductDTO.ProductRequest request) {
        log.info("创建商品请求: {}", request);
        try {
            Long productId = productService.createProduct(request);
            return Result.success(productId, "商品创建成功");
        } catch (Exception e) {
            log.error("创建商品失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 管理员接口：更新商品
     */
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO.ProductRequest request) {
        log.info("更新商品请求 - ID: {}, 请求: {}", id, request);
        try {
            productService.updateProduct(id, request);
            return Result.success(null, "商品更新成功");
        } catch (Exception e) {
            log.error("更新商品失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 管理员接口：删除商品
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteProduct(@PathVariable Long id) {
        log.info("删除商品请求 - ID: {}", id);
        try {
            productService.deleteProduct(id);
            return Result.success(null, "商品删除成功");
        } catch (Exception e) {
            log.error("删除商品失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 管理员接口：更新商品状态（上架/下架）
     */
    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateProductStatus(@PathVariable Long id, @RequestParam Integer status) {
        log.info("更新商品状态请求 - ID: {}, 状态: {}", id, status);
        try {
            productService.updateProductStatus(id, status);
            return Result.success(null, "商品状态更新成功");
        } catch (Exception e) {
            log.error("更新商品状态失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }
} 