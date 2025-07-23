package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleInfoDto {
    
    @JsonProperty("role_id")
    private Integer roleId;
    
    @JsonProperty("role_name")
    private String roleName;
} 