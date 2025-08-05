package com.market_os.inventory_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantDto {
    private String id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private Boolean isActive;
} 