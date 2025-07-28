package com.market_os.tenant_service.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    @Value("${app.file-storage.tenant-logos.path:uploads/tenant-logos}")
    private String tenantLogoStoragePath;
    
    @Value("${app.file-storage.base-url:http://localhost:8083}")
    private String baseUrl;
    
    @Value("${app.file-storage.max-file-size:5242880}") // 5MB default
    private long maxFileSize;
    
    public String storeTenantLogo(UUID tenantId, MultipartFile file) {
        try {
            // Validate file
            validateFile(file);
            
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(tenantLogoStoragePath);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String filename = tenantId + "_" + System.currentTimeMillis() + fileExtension;
            
            // Store file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return accessible URL
            String fileUrl = baseUrl + "/api/v1/files/tenant-logos/" + filename;
            log.info("Stored tenant logo for tenant {}: {}", tenantId, fileUrl);
            
            return fileUrl;
            
        } catch (IOException e) {
            log.error("Failed to store tenant logo for tenant {}: {}", tenantId, e.getMessage());
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
    
    public void deleteTenantLogo(String logoUrl) {
        try {
            if (logoUrl != null && logoUrl.contains("/tenant-logos/")) {
                String filename = logoUrl.substring(logoUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get(tenantLogoStoragePath).resolve(filename);
                
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    log.info("Deleted tenant logo file: {}", filename);
                }
            }
        } catch (IOException e) {
            log.error("Failed to delete tenant logo file from URL {}: {}", logoUrl, e.getMessage());
        }
    }
    
    public byte[] getTenantLogo(String filename) {
        try {
            Path filePath = Paths.get(tenantLogoStoragePath).resolve(filename);
            if (Files.exists(filePath)) {
                return Files.readAllBytes(filePath);
            }
            return null;
        } catch (IOException e) {
            log.error("Failed to read tenant logo file {}: {}", filename, e.getMessage());
            return null;
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and GIF images are allowed");
        }
    }
    
    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") ||
               contentType.equals("image/png") ||
               contentType.equals("image/gif") ||
               contentType.equals("image/jpg");
    }
    
    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return ".jpg"; // default extension
    }
} 