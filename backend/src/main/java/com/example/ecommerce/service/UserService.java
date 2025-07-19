package com.example.ecommerce.service;

import com.example.ecommerce.dto.UserDTO;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户注册
     */
    UserDTO.UserResponse register(UserDTO.RegisterRequest request);

    /**
     * 用户登录
     */
    UserDTO.LoginResponse login(UserDTO.LoginRequest request);

    /**
     * 根据ID获取用户信息
     */
    UserDTO.UserResponse getUserById(Long userId);

    /**
     * 更新用户信息
     */
    UserDTO.UserResponse updateUser(Long userId, UserDTO.UpdateRequest request);

    /**
     * 修改密码
     */
    void changePassword(Long userId, UserDTO.ChangePasswordRequest request);

    /**
     * 检查用户名是否可用
     */
    boolean isUsernameAvailable(String username);

    /**
     * 检查邮箱是否可用
     */
    boolean isEmailAvailable(String email);
    
    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);
} 