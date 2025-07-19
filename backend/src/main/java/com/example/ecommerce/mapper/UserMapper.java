package com.example.ecommerce.mapper;


import com.example.ecommerce.entity.User;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 用户Mapper接口
 */
@Mapper
public interface UserMapper {

    /**
     * 根据用户名查询用户
     */
    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(@Param("username") String username);

    /**
     * 根据邮箱查询用户
     */
    @Select("SELECT * FROM user WHERE email = #{email}")
    User findByEmail(@Param("email") String email);

    /**
     * 根据用户名或邮箱查询用户（用于登录）
     */
    @Select("SELECT * FROM user WHERE (username = #{usernameOrEmail} OR email = #{usernameOrEmail})")
    User findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    /**
     * 检查用户名是否存在
     */
    @Select("SELECT COUNT(*) FROM user WHERE username = #{username}")
    int existsByUsername(@Param("username") String username);

    /**
     * 检查邮箱是否存在
     */
    @Select("SELECT COUNT(*) FROM user WHERE email = #{email}")
    int existsByEmail(@Param("email") String email);

    /**
     * 插入用户
     */
    @Insert("INSERT INTO user (username, email, password, phone, avatar, status) " +
            "VALUES (#{username}, #{email}, #{password}, #{phone}, #{avatar}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    /**
     * 根据ID查询用户
     */
    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(@Param("id") Long id);

    /**
     * 根据ID更新用户
     */
    @Update("UPDATE user SET username = #{username}, email = #{email}, password = #{password}, " +
            "phone = #{phone}, avatar = #{avatar}, status = #{status} " +
            "WHERE id = #{id}")
    int updateById(User user);

    /**
     * 根据ID删除用户（逻辑删除）
     */
    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
} 