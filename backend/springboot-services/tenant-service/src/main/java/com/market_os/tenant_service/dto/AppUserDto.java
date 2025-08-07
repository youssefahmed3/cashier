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
public class AppUserDto {
    
    private Integer id;
    
    private String firstname;
    
    private String lastname;
    
    private String email;
    
    @JsonProperty("is_suspended")
    private Boolean isSuspended;
} 