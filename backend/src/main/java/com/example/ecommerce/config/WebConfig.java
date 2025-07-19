package com.example.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 * CORS 配置已移至 SecurityConfig 中以避免冲突
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS 配置已移至 SecurityConfig 中
}
