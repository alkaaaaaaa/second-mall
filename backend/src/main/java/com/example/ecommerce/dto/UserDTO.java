package com.example.ecommerce.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 用户DTO类
 */
public class UserDTO {

    /**
     * 用户注册DTO
     */
    @Data
    public static class RegisterRequest {
        @NotBlank(message = "用户名不能为空")
        @Size(min = 3, max = 20, message = "用户名长度必须在3-20字符之间")
        private String username;

        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        private String email;

        @NotBlank(message = "密码不能为空")
        @Size(min = 6, max = 20, message = "密码长度必须在6-20字符之间")
        private String password;

        @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
        private String phone;
    }

    /**
     * 用户登录DTO
     */
    @Data
    public static class LoginRequest {
        @NotBlank(message = "用户名或邮箱不能为空")
        private String username; // 可以是用户名或邮箱

        @NotBlank(message = "密码不能为空")
        private String password;
    }

    /**
     * 用户信息更新DTO
     */
    @Data
    public static class UpdateRequest {
        @Size(min = 3, max = 20, message = "用户名长度必须在3-20字符之间")
        private String username;

        @Email(message = "邮箱格式不正确")
        private String email;

        @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
        private String phone;

        private String avatar;
    }

    /**
     * 密码修改DTO
     */
    @Data
    public static class ChangePasswordRequest {
        @NotBlank(message = "原密码不能为空")
        private String oldPassword;

        @NotBlank(message = "新密码不能为空")
        @Size(min = 6, max = 20, message = "密码长度必须在6-20字符之间")
        private String newPassword;
    }

    /**
     * 用户信息响应DTO
     */
    @Data
    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String phone;
        private String avatar;
        private Integer status;
    }

    /**
     * 登录响应DTO
     */
    @Data
    public static class LoginResponse {
        private String token;
        private UserResponse user;
    }
} 