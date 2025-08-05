package com.market_os.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemDto {
    
    private String inventoryId;
    private String productId;
    private String productName;
    private String category;
    private String branchId;
    private String tenantId;
    private Integer quantity;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;
} 