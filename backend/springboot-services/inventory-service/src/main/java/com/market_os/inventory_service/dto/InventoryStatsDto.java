package com.market_os.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryStatsDto {
    
    private Long totalItems;
    private Double totalValue;
    private Integer totalQuantity;
    private Long lowStockItemsCount;
    private Integer distinctLocationsCount;
    private Integer distinctSuppliersCount;
} 