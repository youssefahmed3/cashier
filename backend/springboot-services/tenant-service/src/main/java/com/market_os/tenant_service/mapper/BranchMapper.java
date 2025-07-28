package com.market_os.tenant_service.mapper;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.model.Branch;

import java.util.List;
import java.util.stream.Collectors;

public class BranchMapper {
    
    /**
     * Map entity to DTO
     */
    public static BranchDto toDto(Branch branch) {
        if (branch == null) {
            return null;
        }
        
        BranchDto dto = new BranchDto();
        dto.setId(branch.getId());
        dto.setTenantId(branch.getTenantId());
        dto.setName(branch.getName());
        dto.setPhone(branch.getPhone());
        dto.setLocation(branch.getLocation());
        dto.setTaxPercentage(branch.getTaxPercentage());
        dto.setCreatedAt(branch.getCreatedAt());
        return dto;
    }
    
    /**
     * Map list of entities to DTOs
     */
    public static List<BranchDto> toDtoList(List<Branch> branches) {
        if (branches == null) {
            return null;
        }
        
        return branches.stream()
                .map(BranchMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Map CreateBranchDto to entity
     */
    public static Branch toEntity(CreateBranchDto createBranchDto) {
        if (createBranchDto == null) {
            return null;
        }
        
        Branch branch = new Branch();
        branch.setName(createBranchDto.getName());
        branch.setPhone(createBranchDto.getPhone());
        branch.setLocation(createBranchDto.getLocation());
        branch.setTaxPercentage(createBranchDto.getTaxPercentage());
        return branch;
    }
    
    /**
     * Update entity from UpdateBranchDto
     */
    public static void updateEntityFromDto(UpdateBranchDto updateBranchDto, Branch branch) {
        if (updateBranchDto == null || branch == null) {
            return;
        }
        
        if (updateBranchDto.getName() != null) {
            branch.setName(updateBranchDto.getName());
        }
        if (updateBranchDto.getPhone() != null) {
            branch.setPhone(updateBranchDto.getPhone());
        }
        if (updateBranchDto.getLocation() != null) {
            branch.setLocation(updateBranchDto.getLocation());
        }
        if (updateBranchDto.getTaxPercentage() != null) {
            branch.setTaxPercentage(updateBranchDto.getTaxPercentage());
        }
    }
} 