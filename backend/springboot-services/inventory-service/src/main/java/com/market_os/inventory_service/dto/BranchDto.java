package com.market_os.inventory_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {
    private String id;
    private String name;
    private String address;
    private String phone;
    
    @JsonProperty("tenant_id")
    private String tenantId;
    
    @JsonProperty("tax_percentage")
    private Double taxPercentage;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("is_active")
    private Boolean isActive;
}