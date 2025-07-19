package com.example.ecommerce.controller;

import com.example.ecommerce.common.Result;
import com.example.ecommerce.dto.UserDTO.*;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("用户注册请求: {}", request.getUsername());
        try {
            UserResponse response = userService.register(request);
            return Result.success(response, "注册成功");
        } catch (Exception e) {
            log.error("用户注册失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("用户登录请求: {}", request.getUsername());
        try {
            LoginResponse response = userService.login(request);
            return Result.success(response, "登录成功");
        } catch (Exception e) {
            log.error("用户登录失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/profile")
    public Result<UserResponse> getCurrentUser() {
        try {
            // TODO: 从JWT token中获取用户ID
            Long userId = 1L; // 临时实现
            UserResponse response = userService.getUserById(userId);
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取用户信息失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public Result<UserResponse> updateProfile(@Valid @RequestBody UpdateRequest request) {
        try {
            Long userId = 1L; // 临时实现
            UserResponse response = userService.updateUser(userId, request);
            return Result.success(response, "更新成功");
        } catch (Exception e) {
            log.error("更新用户信息失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/check-username")
    public Result<Boolean> checkUsername(@RequestParam String username) {
        try {
            boolean available = userService.isUsernameAvailable(username);
            return Result.success(available);
        } catch (Exception e) {
            log.error("检查用户名失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/check-email")
    public Result<Boolean> checkEmail(@RequestParam String email) {
        try {
            boolean available = userService.isEmailAvailable(email);
            return Result.success(available);
        } catch (Exception e) {
            log.error("检查邮箱失败: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }
}