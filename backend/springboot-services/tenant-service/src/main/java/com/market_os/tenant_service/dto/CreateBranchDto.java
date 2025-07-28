package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBranchDto {
    
    @NotBlank(message = "Branch name is required")
    @Size(max = 255, message = "Branch name must not exceed 255 characters")
    private String name;
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;
    
    @Size(max = 500, message = "Location must not exceed 500 characters")
    private String location;
    
    @JsonProperty("tax_percentage")
    @DecimalMin(value = "0.0", inclusive = true, message = "Tax percentage must be greater than or equal to 0")
    @DecimalMax(value = "100.0", inclusive = true, message = "Tax percentage must be less than or equal to 100")
    @Digits(integer = 3, fraction = 2, message = "Tax percentage must have at most 3 integer digits and 2 fraction digits")
    private BigDecimal taxPercentage;
} 