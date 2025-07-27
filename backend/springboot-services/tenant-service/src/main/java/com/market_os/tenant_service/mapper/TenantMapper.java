package com.market_os.tenant_service.mapper;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.model.Tenant;

import java.util.List;
import java.util.stream.Collectors;

public class TenantMapper {
    
    /**
     * Map entity to DTO
     */
    public static TenantDto toDto(Tenant tenant) {
        if (tenant == null) {
            return null;
        }
        
        TenantDto dto = new TenantDto();
        dto.setId(tenant.getId());
        dto.setName(tenant.getName());
        dto.setIsActive(tenant.getIsActive());
        dto.setLogoUrl(tenant.getLogoUrl());
        dto.setCreatedAt(tenant.getCreatedAt());
        return dto;
    }
    
 
     //Map list of entities to DTOs

    public static List<TenantDto> toDtoList(List<Tenant> tenants) {
        if (tenants == null) {
            return null;
        }
        
        return tenants.stream()
                .map(TenantMapper::toDto)
                .collect(Collectors.toList());
    }
    
    
     //Map CreateTenantDto to entity
     
    public static Tenant toEntity(CreateTenantDto createTenantDto) {
        if (createTenantDto == null) {
            return null;
        }
        
        Tenant tenant = new Tenant();
        tenant.setName(createTenantDto.getName());
        tenant.setIsActive(createTenantDto.getIsActive());
        // logoUrl will be set separately after file upload
        return tenant;
    }
    
    /**
     * Map entity to TenantWithBranchesDto
     */
    public static TenantWithBranchesDto toTenantWithBranchesDto(Tenant tenant) {
        if (tenant == null) {
            return null;
        }
        
        TenantWithBranchesDto dto = new TenantWithBranchesDto();
        dto.setId(tenant.getId());
        dto.setName(tenant.getName());
        dto.setIsActive(tenant.getIsActive());
        dto.setLogoUrl(tenant.getLogoUrl());
        dto.setCreatedAt(tenant.getCreatedAt());
        
        if (tenant.getBranches() != null) {
            dto.setBranches(tenant.getBranches().stream()
                    .map(BranchMapper::toDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    /**
     * Update entity from UpdateTenantDto
     */
    public static void updateEntityFromDto(UpdateTenantDto updateTenantDto, Tenant tenant) {
        if (updateTenantDto == null || tenant == null) {
            return;
        }
        
        if (updateTenantDto.getName() != null) {
            tenant.setName(updateTenantDto.getName());
        }
        if (updateTenantDto.getIsActive() != null) {
            tenant.setIsActive(updateTenantDto.getIsActive());
        }
        // logoUrl will be updated separately via file upload
    }
} 