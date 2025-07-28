package com.market_os.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemDto {
    
    private Long id;
    private LocalDate purchDate;
    private String location;
    private Integer qty;
    private String productName;
    private String productSku;
    private Double unitPrice;
    private Double totalCost;
    private String supplier;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 