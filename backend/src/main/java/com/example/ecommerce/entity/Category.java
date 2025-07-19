package com.example.ecommerce.entity;



import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 商品分类实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)

public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 分类ID
     */

    private Long id;

    /**
     * 分类名称
     */

    private String name;

    /**
     * 分类描述
     */

    private String description;

    /**
     * 父分类ID，0表示顶级分类
     */

    private Long parentId;

    /**
     * 排序序号
     */

    private Integer sortOrder;

    /**
     * 分类状态：1-启用，0-禁用
     */

    private Integer status;

    /**
     * 创建时间
     */

    private LocalDateTime createdAt;

    /**
     * 更新时间
     */

    private LocalDateTime updatedAt;

    /**
     * 逻辑删除标记：0-未删除，1-已删除
     */

    private Integer isDeleted;
} 