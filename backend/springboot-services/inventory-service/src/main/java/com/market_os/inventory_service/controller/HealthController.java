package com.market_os.inventory_service.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Slf4j
@Tag(name = "Health Check", description = "Health check endpoints for inventory service")
public class HealthController {
    
    @GetMapping
    @Operation(summary = "Health check", description = "Returns the health status of the inventory service")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Service is healthy"),
            @ApiResponse(responseCode = "500", description = "Service is unhealthy")
    })
    public ResponseEntity<Map<String, Object>> health() {
        log.info("Health check requested");
        
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "inventory-service");
        health.put("timestamp", LocalDateTime.now());
        health.put("version", "1.0.0");
        
        return ResponseEntity.ok(health);
    }
} 