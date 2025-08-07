package com.market_os.tenant_service.controller;

import com.market_os.tenant_service.dto.*;
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

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Creating branch for tenant: {} with roles: {}", tenantId, currentUserRoles);

        // For SUPER_ADMIN, allow creating branches for any tenant
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            BranchDto createdBranch = branchService.createBranch(tenantId, createBranchDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBranch);
        }

        // For other roles, check tenant access through UserRoleService
        if (!userContextService.canCreateBranches(tenantId)) {
            log.warn("User attempted to create branch for tenant {} without permission", tenantId);
            throw new AccessDeniedException("You don't have permission to create branches for this tenant");
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

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting all branches with pagination with roles: {}", currentUserRoles);

        // For SUPER_ADMIN, only check role - no user ID required
        if (!currentUserRoles.contains("SUPER_ADMIN")) {
            log.warn("Non-SUPER_ADMIN user attempted to access all branches with roles: {}", currentUserRoles);
            throw new AccessDeniedException("Only SUPER_ADMIN can view all branches");
        }

        Page<BranchDto> branches = branchService.getAllBranches(pageable);

        return ResponseEntity.ok(branches);
    }

    @GetMapping("/api/v1/tenants/{tenantId}/branches")
    @Operation(summary = "Get all branches for a tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<BranchDto>> getBranchesByTenantId(
            @Parameter(description = "Tenant ID") @PathVariable UUID tenantId) {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting branches for tenant: {} with roles: {}", tenantId, currentUserRoles);

        // For SUPER_ADMIN, allow access to any tenant's branches
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            List<BranchDto> branches = branchService.getBranchesByTenantId(tenantId);
            return ResponseEntity.ok(branches);
        }

        // For other roles, check tenant access through UserRoleService
        if (!userContextService.canViewBranches(tenantId)) {
            log.warn("User attempted to get branches for tenant {} without permission", tenantId);
            throw new AccessDeniedException("You don't have permission to access branches for this tenant");
        }

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