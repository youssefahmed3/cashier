package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionStatusDto {
    
    @JsonProperty("tenant_id")
    private UUID tenantId;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    private String status;
    
    @JsonProperty("plan_name")
    private String planName;
} 