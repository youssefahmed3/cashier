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
public class CreateInventoryItemDto {
    
    @NotBlank(message = "Product ID is required")
    @Size(max = 50, message = "Product ID must not exceed 50 characters")
    private String productId;
    
    @NotBlank(message = "Branch ID is required")
    @Size(max = 50, message = "Branch ID must not exceed 50 characters")
    private String branchId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer quantity;
} 