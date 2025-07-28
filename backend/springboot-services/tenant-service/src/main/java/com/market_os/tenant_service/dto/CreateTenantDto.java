package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTenantDto {
    
    @NotBlank(message = "Tenant name is required")
    @Size(max = 255, message = "Tenant name must not exceed 255 characters")
    private String name;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    // Logo will be uploaded separately from file upload endpoint
} 