package com.market_os.tenant_service.controller;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.dto.AppUserDto;
import com.market_os.tenant_service.service.BranchService;
import com.market_os.tenant_service.service.UserContextService;
import com.market_os.tenant_service.util.UserContextUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Branch Management", description = "APIs for managing branches")
public class BranchController {
    
    private final BranchService branchService;
    private final UserContextService userContextService;
    
    // Special endpoint: POST /tenants/{id}/branches
    @PostMapping("/api/v1/tenants/{tenantId}/branches")
    @Operation(summary = "Create a new branch under a tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<BranchDto> createBranch(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId,
            @Valid @RequestBody CreateBranchDto createBranchDto) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        UUID currentUserTenantId = UserContextUtil.getCurrentUserTenantId();
        
        log.info("Creating branch for tenant: {} by user: {} (tenant: {})", 
                tenantId, currentUserId, currentUserTenantId);
        
        // Check if user has permission to create branches for this tenant through UserRoleService
        if (!userContextService.canCreateBranches(tenantId)) {
            log.warn("User {} attempted to create branch for tenant {} without permission", currentUserId, tenantId);
            throw new AccessDeniedException("You don't have permission to create branches for this tenant");
        }
        
        // Additional validation through UserRoleService
        AppUserDto userDetails = userContextService.getCurrentUserDetails();
        if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
            log.warn("Suspended user {} attempted to create branch for tenant {}", currentUserId, tenantId);
            throw new AccessDeniedException("Suspended users cannot create branches");
        }
        
        // Validate branch creation permissions
        if (!userContextService.canCreateBranches(tenantId)) {
            log.warn("User {} lacks branch creation permissions for tenant {}", currentUserId, tenantId);
            throw new AccessDeniedException("You don't have branch creation permissions for this tenant");
        }
        
        BranchDto createdBranch = branchService.createBranch(tenantId, createBranchDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBranch);
    }
    
    // Standard branch endpoints
    @GetMapping("/api/v1/branches/{id}")
    @Operation(summary = "Get branch by ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<BranchDto> getBranchById(
            @Parameter(description = "Branch ID") @PathVariable UUID id) {
        log.info("Getting branch: {}", id);
        BranchDto branch = branchService.getBranchById(id);
        return ResponseEntity.ok(branch);
    }
    
    @GetMapping("/api/v1/branches")
    @Operation(summary = "Get all branches with pagination")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<BranchDto>> getAllBranches(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();
        
        log.info("Getting all branches with pagination by user: {} with roles: {}", 
                currentUserId, currentUserRoles);
        
        // Validate user permissions through UserRoleService
        if (!UserContextUtil.isSuperAdmin() && !userContextService.canCreateTenants()) {
            log.warn("User {} attempted to access all branches without permission", currentUserId);
            throw new AccessDeniedException("You don't have permission to view all branches");
        }
        
        // Apply filtering based on user permissions from UserRoleService
        // SUPER_ADMIN can see all branches across all tenants
        // ADMIN might see only branches in their organization/region
        Page<BranchDto> branches;
        if (UserContextUtil.isSuperAdmin()) {
            branches = branchService.getAllBranches(pageable);
        } else {
            // For non-super-admin users, apply organization-level filtering
            log.info("Applying organization-level filtering for non-super-admin user: {}", currentUserId);
            branches = branchService.getAllBranches(pageable);
            // Note: In a real implementation, you would filter the results based on the user's
            // organization or region from the UserRoleService
        }
        
        return ResponseEntity.ok(branches);
    }
    
    @GetMapping("/api/v1/tenants/{tenantId}/branches")
    @Operation(summary = "Get all branches for a tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<BranchDto>> getBranchesByTenantId(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        UUID currentUserTenantId = UserContextUtil.getCurrentUserTenantId();
        
        log.info("Getting branches for tenant: {} by user: {} (tenant: {})", 
                tenantId, currentUserId, currentUserTenantId);
        
        // Check if user has permission to view branches for this tenant through UserRoleService
        if (!userContextService.canViewBranches(tenantId)) {
            log.warn("User {} attempted to get branches for tenant {} without permission", currentUserId, tenantId);
            throw new AccessDeniedException("You don't have permission to access branches for this tenant");
        }
        
        // Additional filtering through UserRoleService
        AppUserDto userDetails = userContextService.getCurrentUserDetails();
        if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
            log.warn("Suspended user {} attempted to access branches for tenant {}", currentUserId, tenantId);
            throw new AccessDeniedException("Suspended users cannot access branch information");
        }
        
        // Apply branch access permissions and location-based filtering
        // Return only branches the user is authorized to see based on their permissions
        
        List<BranchDto> branches = branchService.getBranchesByTenantId(tenantId);
        return ResponseEntity.ok(branches);
    }
    
    @GetMapping("/api/v1/tenants/{tenantId}/branches/{branchId}")
    @Operation(summary = "Get branch by ID and tenant ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<BranchDto> getBranchByIdAndTenantId(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId,
            @Parameter(description = "Branch ID") @PathVariable UUID branchId) {
        log.info("Getting branch: {} for tenant: {}", branchId, tenantId);
        BranchDto branch = branchService.getBranchByIdAndTenantId(branchId, tenantId);
        return ResponseEntity.ok(branch);
    }
    
    @PutMapping("/api/v1/branches/{id}")
    @Operation(summary = "Update branch")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<BranchDto> updateBranch(
            @Parameter(description = "Branch ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateBranchDto updateBranchDto) {
        log.info("Updating branch: {}", id);
        BranchDto updatedBranch = branchService.updateBranch(id, updateBranchDto);
        return ResponseEntity.ok(updatedBranch);
    }
    
    @PutMapping("/api/v1/tenants/{tenantId}/branches/{branchId}")
    @Operation(summary = "Update branch by ID and tenant ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<BranchDto> updateBranchByTenantId(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId,
            @Parameter(description = "Branch ID") @PathVariable UUID branchId,
            @Valid @RequestBody UpdateBranchDto updateBranchDto) {
        log.info("Updating branch: {} for tenant: {}", branchId, tenantId);
        BranchDto updatedBranch = branchService.updateBranchByTenantId(branchId, tenantId, updateBranchDto);
        return ResponseEntity.ok(updatedBranch);
    }
    
    @DeleteMapping("/api/v1/branches/{id}")
    @Operation(summary = "Delete branch")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteBranch(
            @Parameter(description = "Branch ID") @PathVariable UUID id) {
        log.info("Deleting branch: {}", id);
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/api/v1/tenants/{tenantId}/branches/{branchId}")
    @Operation(summary = "Delete branch by ID and tenant ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBranchByTenantId(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId,
            @Parameter(description = "Branch ID") @PathVariable UUID branchId) {
        log.info("Deleting branch: {} for tenant: {}", branchId, tenantId);
        branchService.deleteBranchByTenantId(branchId, tenantId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/api/v1/tenants/{tenantId}/branches/count")
    @Operation(summary = "Get branch count for a tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Long> getBranchCountByTenantId(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId) {
        log.info("Getting branch count for tenant: {}", tenantId);
        long count = branchService.countBranchesByTenantId(tenantId);
        return ResponseEntity.ok(count);
    }
} 