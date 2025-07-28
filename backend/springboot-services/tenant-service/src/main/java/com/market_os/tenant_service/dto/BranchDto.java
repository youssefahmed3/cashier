package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {
    
    private UUID id;
    
    @JsonProperty("tenant_id")
    private UUID tenantId;
    
    private String name;
    
    private String phone;
    
    private String location;
    
    @JsonProperty("tax_percentage")
    private BigDecimal taxPercentage;
    
    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
} 