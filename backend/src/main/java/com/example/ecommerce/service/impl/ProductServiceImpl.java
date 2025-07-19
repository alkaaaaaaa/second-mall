package com.example.ecommerce.service.impl;


import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.mapper.CategoryMapper;
import com.example.ecommerce.mapper.ProductMapper;
import com.example.ecommerce.service.ProductService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 商品服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public Long createProduct(ProductDTO.ProductRequest request) {
        // 检查分类是否存在
        Category category = categoryMapper.selectById(request.getCategoryId());
        if (category == null || category.getStatus() != 1) {
            throw new RuntimeException("商品分类不存在或已禁用");
        }

        // 创建商品
        Product product = new Product();
        BeanUtils.copyProperties(request, product);
        product.setSalesCount(0); // 初始销量为0

        int result = productMapper.insert(product);
        if (result <= 0) {
            throw new RuntimeException("商品创建失败");
        }

        log.info("商品创建成功，商品ID：{}", product.getId());
        return product.getId();
    }

    @Override
    @Transactional
    public void updateProduct(Long productId, ProductDTO.ProductRequest request) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }

        // 检查分类是否存在
        if (!request.getCategoryId().equals(product.getCategoryId())) {
            Category category = categoryMapper.selectById(request.getCategoryId());
            if (category == null || category.getStatus() != 1) {
                throw new RuntimeException("商品分类不存在或已禁用");
            }
        }

        // 更新商品信息
        BeanUtils.copyProperties(request, product);
        product.setId(productId); // 确保ID不变

        int result = productMapper.updateById(product);
        if (result <= 0) {
            throw new RuntimeException("商品更新失败");
        }

        log.info("商品更新成功，商品ID：{}", productId);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }

        int result = productMapper.deleteById(productId);
        if (result <= 0) {
            throw new RuntimeException("商品删除失败");
        }

        log.info("商品删除成功，商品ID：{}", productId);
    }

    @Override
    public ProductDTO.ProductResponse getProductDetail(Long productId) {
        ProductDTO.ProductResponse product = productMapper.findProductDetailById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }
        return product;
    }

    @Override
    public ProductDTO.PageResponse<ProductDTO.ProductListResponse> getProductList(ProductDTO.ProductQuery query) {
        // 计算分页参数
        int page = query.getPage() != null ? query.getPage() : 1;
        int size = query.getSize() != null ? query.getSize() : 10;
        int offset = (page - 1) * size;

        // 查询商品列表
        List<ProductDTO.ProductListResponse> records = productMapper.findProductsWithCategory(query, offset, size);
        
        // 查询总数
        long total = productMapper.countProducts(query);
        
        // 计算总页数
        int pages = (int) Math.ceil((double) total / size);

        // 构建返回结果
        ProductDTO.PageResponse<ProductDTO.ProductListResponse> response = new ProductDTO.PageResponse<>();
        response.setRecords(records);
        response.setTotal(total);
        response.setPage(page);
        response.setSize(size);
        response.setPages(pages);

        return response;
    }

    @Override
    @Transactional
    public void updateProductStatus(Long productId, Integer status) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }

        product.setStatus(status);
        int result = productMapper.updateById(product);
        if (result <= 0) {
            throw new RuntimeException("商品状态更新失败");
        }

        log.info("商品状态更新成功，商品ID：{}，状态：{}", productId, status);
    }

    @Override
    @Transactional
    public boolean decreaseStock(Long productId, Integer quantity) {
        int result = productMapper.decreaseStock(productId, quantity);
        if (result > 0) {
            log.info("商品库存减少成功，商品ID：{}，减少数量：{}", productId, quantity);
            return true;
        } else {
            log.warn("商品库存减少失败，商品ID：{}，减少数量：{}", productId, quantity);
            return false;
        }
    }

    @Override
    @Transactional
    public void increaseStock(Long productId, Integer quantity) {
        int result = productMapper.increaseStock(productId, quantity);
        if (result <= 0) {
            throw new RuntimeException("商品库存增加失败");
        }

        log.info("商品库存增加成功，商品ID：{}，增加数量：{}", productId, quantity);
    }

    @Override
    @Transactional
    public void updateSalesCount(Long productId, Integer quantity) {
        int result = productMapper.updateSalesCount(productId, quantity);
        if (result <= 0) {
            throw new RuntimeException("商品销量更新失败");
        }

        log.info("商品销量更新成功，商品ID：{}，增加销量：{}", productId, quantity);
    }
} 