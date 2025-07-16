package com.market_os.tenant_service.mapper;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.model.Tenant;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TenantMapper {
    
    /**
     * Map entity to DTO
     */
    @Mapping(target = "logoUrl", source = "logoUrl")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "createdAt", source = "createdAt")
    TenantDto toDto(Tenant tenant);
    
    /**
     * Map list of entities to DTOs
     */
    List<TenantDto> toDtoList(List<Tenant> tenants);
    
    /**
     * Map CreateTenantDto to entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "branches", ignore = true)
    @Mapping(target = "logoUrl", ignore = true) // Set separately after file upload
    @Mapping(target = "isActive", source = "isActive")
    Tenant toEntity(CreateTenantDto createTenantDto);
    
    /**
     * Map entity to TenantWithBranchesDto
     */
    @Mapping(target = "logoUrl", source = "logoUrl")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "branches", source = "branches")
    TenantWithBranchesDto toTenantWithBranchesDto(Tenant tenant);
    
    /**
     * Update entity from UpdateTenantDto
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "branches", ignore = true)
    @Mapping(target = "logoUrl", ignore = true) // Updated separately via file upload
    @Mapping(target = "isActive", source = "isActive")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateTenantDto updateTenantDto, @MappingTarget Tenant tenant);
} 