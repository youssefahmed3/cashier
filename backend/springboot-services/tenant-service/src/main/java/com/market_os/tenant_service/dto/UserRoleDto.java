package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleDto {
    
    @JsonProperty("user_id")
    private UUID userId;
    
    private String username;
    
    private String email;
    
    private List<String> roles;
    
    @JsonProperty("tenant_id")
    private UUID tenantId;
    
    @JsonProperty("is_active")
    private Boolean isActive;
} 