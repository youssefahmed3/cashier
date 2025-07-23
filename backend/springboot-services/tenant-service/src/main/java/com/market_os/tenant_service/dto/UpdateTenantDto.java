package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTenantDto {
    
    @Size(max = 255, message = "Tenant name must not exceed 255 characters")
    private String name;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    // Logo will be updated separately via file upload endpoint
} 