package com.market_os.inventory_service.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInventoryItemDto {
    
    @NotNull(message = "Purchase date is required")
    private LocalDate purchDate;
    
    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer qty;
    
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String productName;
    
    @Size(max = 100, message = "Product SKU must not exceed 100 characters")
    private String productSku;
    
    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price must be greater than or equal to 0")
    private Double unitPrice;
    
    @Size(max = 255, message = "Supplier name must not exceed 255 characters")
    private String supplier;
} 