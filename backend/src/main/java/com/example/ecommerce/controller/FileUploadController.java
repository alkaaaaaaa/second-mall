package com.example.ecommerce.controller;

import com.example.ecommerce.common.Result;
import com.example.ecommerce.utils.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件上传控制器
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final FileUtils fileUtils;

    @Value("${app.upload.base-url}")
    private String baseUrl;

    /**
     * 上传商品图片
     */
    @PostMapping("/product-image")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Map<String, String>> uploadProductImage(@RequestParam("file") MultipartFile file) {
        log.info("商品图片上传请求 - 文件名: {}, 大小: {} bytes", file.getOriginalFilename(), file.getSize());
        
        try {
            // 校验文件
            if (file.isEmpty()) {
                return Result.error("上传的文件不能为空");
            }
            
            // 校验文件类型
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Result.error("只能上传图片文件");
            }
            
            // 校验文件大小（限制为2MB）
            if (file.getSize() > 2 * 1024 * 1024) {
                return Result.error("图片大小不能超过2MB");
            }
            
            // 保存文件
            String fileName = fileUtils.saveProductImage(file);
            String fileUrl = baseUrl + "/images/products/" + fileName;
            
            // 返回文件URL
            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            data.put("fileName", fileName);
            
            return Result.success(data, "图片上传成功");
        } catch (IOException e) {
            log.error("商品图片上传失败: {}", e.getMessage(), e);
            return Result.error("图片上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除商品图片
     */
    @DeleteMapping("/product-image/{fileName}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteProductImage(@PathVariable String fileName) {
        log.info("商品图片删除请求 - 文件名: {}", fileName);
        
        try {
            boolean deleted = fileUtils.deleteProductImage(fileName);
            if (deleted) {
                return Result.success(null, "图片删除成功");
            } else {
                return Result.error("图片删除失败");
            }
        } catch (IOException e) {
            log.error("商品图片删除失败: {}", e.getMessage(), e);
            return Result.error("图片删除失败: " + e.getMessage());
        }
    }
}
