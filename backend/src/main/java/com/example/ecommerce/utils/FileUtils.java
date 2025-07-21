package com.example.ecommerce.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 文件处理工具类
 */
@Component
@Slf4j
public class FileUtils {

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * 保存商品图片
     *
     * @param file 上传的文件
     * @return 文件名
     * @throws IOException 如果文件保存失败
     */
    public String saveProductImage(MultipartFile file) throws IOException {
        // 创建目录（如果不存在）
        String productImageDir = uploadDir + "/images/products";
        Path dirPath = Paths.get(productImageDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
            log.info("创建商品图片目录: {}", productImageDir);
        }

        // 生成文件名（使用UUID防止文件名冲突）
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID() + extension;

        // 保存文件
        Path filePath = Paths.get(productImageDir, fileName);
        Files.copy(file.getInputStream(), filePath);
        log.info("商品图片保存成功: {}", filePath);

        return fileName;
    }

    /**
     * 删除商品图片
     *
     * @param fileName 文件名
     * @return 是否删除成功
     * @throws IOException 如果文件删除失败
     */
    public boolean deleteProductImage(String fileName) throws IOException {
        String productImageDir = uploadDir + "/images/products";
        Path filePath = Paths.get(productImageDir, fileName);
        
        // 检查文件是否存在
        if (!Files.exists(filePath)) {
            log.warn("要删除的商品图片不存在: {}", filePath);
            return false;
        }
        
        // 删除文件
        Files.delete(filePath);
        log.info("商品图片删除成功: {}", filePath);
        return true;
    }
}
