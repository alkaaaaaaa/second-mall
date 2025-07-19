package com.example.ecommerce.service.impl;

import com.example.ecommerce.dto.UserDTO;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.mapper.UserMapper;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDTO.UserResponse register(UserDTO.RegisterRequest request) {
        // 检查用户名是否已存在
        if (existsByUsername(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查邮箱是否已存在
        if (existsByEmail(request.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }

        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setStatus(1); // 默认启用

        int result = userMapper.insert(user);
        if (result <= 0) {
            throw new RuntimeException("用户注册失败");
        }

        log.info("用户注册成功，用户名：{}", request.getUsername());
        
        // 返回用户信息
        UserDTO.UserResponse response = new UserDTO.UserResponse();
        BeanUtils.copyProperties(user, response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO.LoginResponse login(UserDTO.LoginRequest request) {
        // 根据用户名或邮箱查找用户
        User user = userMapper.findByUsernameOrEmail(request.getUsername());
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查用户状态
        if (user.getStatus() != 1) {
            throw new RuntimeException("用户已被禁用");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 生成JWT token（这里暂时返回用户ID作为token，实际项目中应该生成JWT）
        String token = "user_" + user.getId() + "_" + System.currentTimeMillis();

        // 构建响应
        UserDTO.UserResponse userResponse = new UserDTO.UserResponse();
        BeanUtils.copyProperties(user, userResponse);

        UserDTO.LoginResponse response = new UserDTO.LoginResponse();
        response.setToken(token);
        response.setUser(userResponse);

        log.info("用户登录成功，用户名：{}", user.getUsername());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO.UserResponse getUserById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        UserDTO.UserResponse response = new UserDTO.UserResponse();
        BeanUtils.copyProperties(user, response);
        return response;
    }

    @Override
    @Transactional
    public UserDTO.UserResponse updateUser(Long userId, UserDTO.UpdateRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 检查用户名是否重复（排除当前用户）
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (existsByUsername(request.getUsername())) {
                throw new RuntimeException("用户名已存在");
            }
            user.setUsername(request.getUsername());
        }

        // 检查邮箱是否重复（排除当前用户）
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (existsByEmail(request.getEmail())) {
                throw new RuntimeException("邮箱已存在");
            }
            user.setEmail(request.getEmail());
        }

        // 更新其他字段
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        int result = userMapper.updateById(user);
        if (result <= 0) {
            throw new RuntimeException("用户信息更新失败");
        }

        log.info("用户信息更新成功，用户ID：{}", userId);
        
        // 返回更新后的用户信息
        UserDTO.UserResponse response = new UserDTO.UserResponse();
        BeanUtils.copyProperties(user, response);
        return response;
    }

    @Override
    @Transactional
    public void changePassword(Long userId, UserDTO.ChangePasswordRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证原密码
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        int result = userMapper.updateById(user);
        if (result <= 0) {
            throw new RuntimeException("密码修改失败");
        }

        log.info("用户密码修改成功，用户ID：{}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        return userMapper.existsByUsername(username) == 0;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return userMapper.existsByEmail(email) == 0;
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userMapper.existsByUsername(username) > 0;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userMapper.existsByEmail(email) > 0;
    }
} 