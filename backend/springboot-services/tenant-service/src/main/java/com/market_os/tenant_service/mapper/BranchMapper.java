package com.market_os.tenant_service.mapper;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.model.Branch;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchMapper {
    
    /**
     * Map entity to DTO
     */
    @Mapping(target = "tenantId", source = "tenantId")
    @Mapping(target = "taxPercentage", source = "taxPercentage")
    @Mapping(target = "createdAt", source = "createdAt")
    BranchDto toDto(Branch branch);
    
    /**
     * Map list of entities to DTOs
     */
    List<BranchDto> toDtoList(List<Branch> branches);
    
    /**
     * Map CreateBranchDto to entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "taxPercentage", source = "taxPercentage")
    Branch toEntity(CreateBranchDto createBranchDto);
    
    /**
     * Update entity from UpdateBranchDto
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "taxPercentage", source = "taxPercentage")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateBranchDto updateBranchDto, @MappingTarget Branch branch);
} 