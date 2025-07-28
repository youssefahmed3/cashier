package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface BranchService {
    
    /**
     * Create a new branch under a tenant
     */
    BranchDto createBranch(UUID tenantId, CreateBranchDto createBranchDto);
    
    /**
     * Get branch by ID
     */
    BranchDto getBranchById(UUID id);
    
    /**
     * Get branch by ID and tenant ID
     */
    BranchDto getBranchByIdAndTenantId(UUID id, UUID tenantId);
    
    /**
     * Get all branches for a tenant
     */
    List<BranchDto> getBranchesByTenantId(UUID tenantId);
    
    /**
     * Get all branches with pagination
     */
    Page<BranchDto> getAllBranches(Pageable pageable);
    
    /**
     * Update branch
     */
    BranchDto updateBranch(UUID id, UpdateBranchDto updateBranchDto);
    
    /**
     * Update branch by ID and tenant ID
     */
    BranchDto updateBranchByTenantId(UUID id, UUID tenantId, UpdateBranchDto updateBranchDto);
    
    /**
     * Delete branch
     */
    void deleteBranch(UUID id);
    
    /**
     * Delete branch by ID and tenant ID
     */
    void deleteBranchByTenantId(UUID id, UUID tenantId);
    
    /**
     * Check if branch exists
     */
    boolean existsById(UUID id);
    
    /**
     * Count branches for a tenant
     */
    long countBranchesByTenantId(UUID tenantId);
} 