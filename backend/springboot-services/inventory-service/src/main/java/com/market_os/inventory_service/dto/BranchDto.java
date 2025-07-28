package com.market_os.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private Long tenantId;
    private Boolean isActive;
} 