package com.example.ecommerce.controller;

import com.example.ecommerce.common.Result;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.mapper.CategoryMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品分类控制器
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryMapper categoryMapper;

    /**
     * 获取顶级分类
     */
    @GetMapping("/top")
    public Result<List<Category>> getTopCategories() {
        log.info("获取顶级分类请求");
        try {
            List<Category> categories = categoryMapper.findTopCategories();
            return Result.success(categories);
        } catch (Exception e) {
            log.error("获取顶级分类失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取子分类
     */
    @GetMapping("/sub/{parentId}")
    public Result<List<Category>> getSubCategories(@PathVariable Long parentId) {
        log.info("获取子分类请求 - 父分类ID: {}", parentId);
        try {
            List<Category> categories = categoryMapper.findByParentId(parentId);
            return Result.success(categories);
        } catch (Exception e) {
            log.error("获取子分类失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 根据ID获取分类
     */
    @GetMapping("/{id}")
    public Result<Category> getCategoryById(@PathVariable Long id) {
        log.info("获取分类详情请求 - ID: {}", id);
        try {
            Category category = categoryMapper.selectById(id);
            if (category == null) {
                return Result.error(404, "分类不存在");
            }
            return Result.success(category);
        } catch (Exception e) {
            log.error("获取分类详情失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 管理员接口：创建分类
     */
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Long> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("创建分类请求: {}", request);
        try {
            // 检查分类名称是否已存在
            int exists = categoryMapper.existsByNameAndParentId(request.getName(), request.getParentId());
            if (exists > 0) {
                return Result.error("分类名称已存在");
            }

            // 如果不是顶级分类，检查父分类是否存在
            if (request.getParentId() != 0) {
                Category parentCategory = categoryMapper.selectById(request.getParentId());
                if (parentCategory == null) {
                    return Result.error("父分类不存在");
                }
            }

            // 创建分类
            Category category = new Category()
                    .setName(request.getName())
                    .setDescription(request.getDescription())
                    .setParentId(request.getParentId())
                    .setSortOrder(request.getSortOrder())
                    .setStatus(1);

            int result = categoryMapper.insert(category);
            if (result <= 0) {
                return Result.error("分类创建失败");
            }

            return Result.success(category.getId(), "分类创建成功");
        } catch (Exception e) {
            log.error("创建分类失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 管理员接口：更新分类
     */
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        log.info("更新分类请求 - ID: {}, 请求: {}", id, request);
        try {
            // 检查分类是否存在
            Category existingCategory = categoryMapper.selectById(id);
            if (existingCategory == null) {
                return Result.error(404, "分类不存在");
            }

            // 检查分类名称是否已存在（排除自身）
            if (!existingCategory.getName().equals(request.getName())) {
                int exists = categoryMapper.existsByNameAndParentId(request.getName(), request.getParentId());
                if (exists > 0) {
                    return Result.error("分类名称已存在");
                }
            }

            // 如果修改了父分类，检查新父分类是否存在
            if (request.getParentId() != 0 && !request.getParentId().equals(existingCategory.getParentId())) {
                Category parentCategory = categoryMapper.selectById(request.getParentId());
                if (parentCategory == null) {
                    return Result.error("父分类不存在");
                }
                
                // 不能将分类的父分类设置为其自身或其子分类
                if (request.getParentId().equals(id)) {
                    return Result.error("不能将分类的父分类设置为其自身");
                }
                
                // TODO: 递归检查不能设置为子分类（此处简化处理）
            }

            // 更新分类
            Category category = new Category()
                    .setId(id)
                    .setName(request.getName())
                    .setDescription(request.getDescription())
                    .setParentId(request.getParentId())
                    .setSortOrder(request.getSortOrder())
                    .setStatus(request.getStatus());

            int result = categoryMapper.updateById(category);
            if (result <= 0) {
                return Result.error("分类更新失败");
            }

            return Result.success(null, "分类更新成功");
        } catch (Exception e) {
            log.error("更新分类失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    /**
     * 管理员接口：删除分类
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        log.info("删除分类请求 - ID: {}", id);
        try {
            // 检查分类是否存在
            Category category = categoryMapper.selectById(id);
            if (category == null) {
                return Result.error(404, "分类不存在");
            }

            // 检查是否有子分类
            List<Category> subCategories = categoryMapper.findByParentId(id);
            if (!subCategories.isEmpty()) {
                return Result.error("不能删除有子分类的分类，请先删除子分类");
            }

            // TODO: 检查分类下是否有商品，如果有则不能删除

            // 删除分类
            int result = categoryMapper.deleteById(id);
            if (result <= 0) {
                return Result.error("分类删除失败");
            }

            return Result.success(null, "分类删除成功");
        } catch (Exception e) {
            log.error("删除分类失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @Data
    public static class CategoryRequest {
        @NotBlank(message = "分类名称不能为空")
        @Size(max = 50, message = "分类名称长度不能超过50字符")
        private String name;

        @Size(max = 200, message = "分类描述长度不能超过200字符")
        private String description;

        @NotNull(message = "父分类ID不能为空")
        private Long parentId = 0L; // 默认为顶级分类

        private Integer sortOrder = 0;

        private Integer status = 1; // 默认启用
    }
}
