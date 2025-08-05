package com.market_os.inventory_service.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInventoryItemDto {
    
    @Size(max = 50, message = "Product ID must not exceed 50 characters")
    private String productId;
    
    @Size(max = 50, message = "Branch ID must not exceed 50 characters")
    private String branchId;
    
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer quantity;
    
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String productName;
    
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
} 