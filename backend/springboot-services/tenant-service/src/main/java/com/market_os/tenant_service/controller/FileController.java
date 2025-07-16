package com.market_os.tenant_service.controller;

import com.market_os.tenant_service.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "File Management", description = "APIs for serving uploaded files")
public class FileController {
    
    private final FileStorageService fileStorageService;
    
    @GetMapping("/tenant-logos/{filename}")
    @Operation(summary = "Get tenant logo file")
    public ResponseEntity<byte[]> getTenantLogo(
            @Parameter(description = "Logo filename") @PathVariable String filename) {
        
        log.info("Serving tenant logo file: {}", filename);
        
        try {
            byte[] fileContent = fileStorageService.getTenantLogo(filename);
            
            if (fileContent == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type based on file extension
            String contentType = getContentType(filename);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(fileContent.length);
            
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error serving tenant logo file {}: {}", filename, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private String getContentType(String filename) {
        String lowercaseFilename = filename.toLowerCase();
        
        if (lowercaseFilename.endsWith(".png")) {
            return "image/png";
        } else if (lowercaseFilename.endsWith(".gif")) {
            return "image/gif";
        } else if (lowercaseFilename.endsWith(".jpg") || lowercaseFilename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else {
            return "application/octet-stream";
        }
    }
} 