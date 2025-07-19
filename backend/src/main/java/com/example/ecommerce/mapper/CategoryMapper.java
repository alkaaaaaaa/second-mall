package com.example.ecommerce.mapper;


import com.example.ecommerce.entity.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 分类Mapper接口
 */
@Mapper
public interface CategoryMapper {

    /**
     * 查询顶级分类
     */
    @Select("SELECT * FROM category WHERE parent_id = 0 AND status = 1 AND is_deleted = 0 ORDER BY sort_order ASC")
    List<Category> findTopCategories();

    /**
     * 根据父分类ID查询子分类
     */
    @Select("SELECT * FROM category WHERE parent_id = #{parentId} AND status = 1 AND is_deleted = 0 ORDER BY sort_order ASC")
    List<Category> findByParentId(@Param("parentId") Long parentId);

    /**
     * 检查分类名称是否存在
     */
    @Select("SELECT COUNT(*) FROM category WHERE name = #{name} AND parent_id = #{parentId} AND is_deleted = 0")
    int existsByNameAndParentId(@Param("name") String name, @Param("parentId") Long parentId);

    /**
     * 插入分类
     */
    @Insert("INSERT INTO category (name, description, parent_id, sort_order, status, created_at, updated_at, is_deleted) " +
            "VALUES (#{name}, #{description}, #{parentId}, #{sortOrder}, #{status}, NOW(), NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Category category);

    /**
     * 根据ID查询分类
     */
    @Select("SELECT * FROM category WHERE id = #{id} AND is_deleted = 0")
    Category selectById(@Param("id") Long id);

    /**
     * 根据ID更新分类
     */
    @Update("UPDATE category SET name = #{name}, description = #{description}, parent_id = #{parentId}, " +
            "sort_order = #{sortOrder}, status = #{status}, updated_at = NOW() WHERE id = #{id} AND is_deleted = 0")
    int updateById(Category category);

    /**
     * 根据ID删除分类（逻辑删除）
     */
    @Update("UPDATE category SET is_deleted = 1, updated_at = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
} 