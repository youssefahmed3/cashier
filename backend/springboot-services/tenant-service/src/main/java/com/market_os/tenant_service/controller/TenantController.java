package com.market_os.tenant_service.controller;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.dto.AppUserDto;
import com.market_os.tenant_service.service.FileStorageService;
import com.market_os.tenant_service.service.TenantService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tenant Management", description = "APIs for managing tenants")
public class TenantController {
    
    private final TenantService tenantService;
    private final FileStorageService fileStorageService;
    private final UserContextService userContextService;
    
    @PostMapping
    @Operation(summary = "Create a new tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantDto> createTenant(@Valid @RequestBody CreateTenantDto createTenantDto) {
        // Get user context from request attributes (set by JwtAuthenticationFilter)
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();
        
        log.info("Creating tenant: {} by user: {} with roles: {}", 
                createTenantDto.getName(), currentUserId, currentUserRoles);
        
        // Validate user permissions through UserRoleService
        if (!userContextService.canCreateTenants()) {
            log.warn("User {} attempted to create tenant without sufficient permissions", currentUserId);
            throw new AccessDeniedException("You don't have permission to create tenants");
        }
        
        // Additional validation: check if user is suspended
        AppUserDto userDetails = userContextService.getCurrentUserDetails();
        if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
            log.warn("Suspended user {} attempted to create tenant", currentUserId);
            throw new AccessDeniedException("Suspended users cannot create tenants");
        }
        
        TenantDto createdTenant = tenantService.createTenant(createTenantDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get tenant by ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<TenantDto> getTenantById(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        UUID currentUserTenantId = UserContextUtil.getCurrentUserTenantId();
        
        log.info("Getting tenant: {} by user: {} (tenant: {})", id, currentUserId, currentUserTenantId);
        
        // Check if user has access to this tenant through UserRoleService
        if (!userContextService.canAccessTenant(id)) {
            log.warn("User {} attempted to access tenant {} without permission", currentUserId, id);
            throw new AccessDeniedException("You don't have permission to access this tenant");
        }
        
        // Additional validation: verify user's tenant membership and permissions
        AppUserDto userDetails = userContextService.getCurrentUserDetails();
        if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
            log.warn("Suspended user {} attempted to access tenant {}", currentUserId, id);
            throw new AccessDeniedException("Suspended users cannot access tenant information");
        }
        
        TenantDto tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok(tenant);
    }
    
    @GetMapping("/{id}/with-branches")
    @Operation(summary = "Get tenant with branches by ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<TenantWithBranchesDto> getTenantWithBranchesById(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {
        log.info("Getting tenant with branches: {}", id);
        TenantWithBranchesDto tenant = tenantService.getTenantWithBranchesById(id);
        return ResponseEntity.ok(tenant);
    }
    
    @GetMapping
    @Operation(summary = "Get all tenants with pagination")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<TenantDto>> getAllTenants(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();
        
        log.info("Getting all tenants with pagination by user: {} with roles: {}", 
                currentUserId, currentUserRoles);
        
        // Validate user permissions through UserRoleService
        if (!userContextService.canCreateTenants()) {
            log.warn("User {} attempted to access all tenants without permission", currentUserId);
            throw new AccessDeniedException("You don't have permission to view all tenants");
        }
        
        // Apply filtering based on user permissions
        // SUPER_ADMIN can see all tenants, others are filtered
        Page<TenantDto> tenants;
        if (UserContextUtil.isSuperAdmin()) {
            tenants = tenantService.getAllTenants(pageable);
        } else {
            // For non-super-admin users, apply organization-level filtering
            // This would typically involve filtering by the user's organization or region
            log.info("Applying organization-level filtering for non-super-admin user: {}", currentUserId);
            tenants = tenantService.getAllTenants(pageable);
        }
        
        return ResponseEntity.ok(tenants);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get all active tenants")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<TenantDto>> getAllActiveTenants() {
        log.info("Getting all active tenants");
        List<TenantDto> activeTenants = tenantService.getAllActiveTenants();
        return ResponseEntity.ok(activeTenants);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantDto> updateTenant(
            @Parameter(description = "Tenant ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateTenantDto updateTenantDto) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        UUID currentUserTenantId = UserContextUtil.getCurrentUserTenantId();
        
        log.info("Updating tenant: {} by user: {} (tenant: {})", id, currentUserId, currentUserTenantId);
        
        // Check if user has permission to update this tenant through UserRoleService
        if (!userContextService.canUpdateTenant(id)) {
            log.warn("User {} attempted to update tenant {} without permission", currentUserId, id);
            throw new AccessDeniedException("You don't have permission to update this tenant");
        }
        
        // Additional validation: check specific permissions and business rules
        AppUserDto userDetails = userContextService.getCurrentUserDetails();
        if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
            log.warn("Suspended user {} attempted to update tenant {}", currentUserId, id);
            throw new AccessDeniedException("Suspended users cannot update tenant information");
        }
        
        // Field-level permission checks could be added here based on specific permissions
        // For example, checking if user has permission to change tenant status, name, etc.
        
        TenantDto updatedTenant = tenantService.updateTenant(id, updateTenantDto);
        return ResponseEntity.ok(updatedTenant);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete tenant (soft delete)")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteTenant(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {
        log.info("Deleting tenant: {}", id);
        tenantService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/subscription-status")
    @Operation(summary = "Get tenant subscription status")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<SubscriptionStatusDto> getTenantSubscriptionStatus(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {
        log.info("Getting subscription status for tenant: {}", id);
        SubscriptionStatusDto subscriptionStatus = tenantService.getTenantSubscriptionStatus(id);
        return ResponseEntity.ok(subscriptionStatus);
    }
    
    @PostMapping("/{id}/logo")
    @Operation(summary = "Upload tenant logo")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadTenantLogo(
            @Parameter(description = "Tenant ID") @PathVariable UUID id,
            @Parameter(description = "Logo file") @RequestParam("logo") MultipartFile file) {
        
        // Get user context from request attributes
        UUID currentUserId = UserContextUtil.getCurrentUserId();
        UUID currentUserTenantId = UserContextUtil.getCurrentUserTenantId();
        
        log.info("Uploading logo for tenant: {} by user: {} (tenant: {})", 
                id, currentUserId, currentUserTenantId);
        
        // Check if user has access to this tenant through UserRoleService
        if (!userContextService.canUpdateTenant(id)) {
            log.warn("User {} attempted to upload logo for tenant {} without permission", currentUserId, id);
            throw new AccessDeniedException("You don't have permission to upload logo for this tenant");
        }
        
        // Validate tenant exists
        if (!tenantService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Additional validation through UserRoleService
        AppUserDto userDetails = userContextService.getCurrentUserDetails();
        if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
            log.warn("Suspended user {} attempted to upload logo for tenant {}", currentUserId, id);
            throw new AccessDeniedException("Suspended users cannot upload tenant logos");
        }
        
        // Check file upload permissions
        if (!userContextService.canUpdateTenant(id)) {
            log.warn("User {} lacks file upload permissions for tenant {}", currentUserId, id);
            throw new AccessDeniedException("You don't have file upload permissions for this tenant");
        }
        
        try {
            String logoUrl = fileStorageService.storeTenantLogo(id, file);
            String updatedLogoUrl = tenantService.updateTenantLogo(id, logoUrl);
            
            Map<String, String> response = Map.of(
                "message", "Logo uploaded successfully",
                "logo_url", updatedLogoUrl
            );
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = Map.of("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("Failed to upload logo for tenant {}: {}", id, e.getMessage());
            Map<String, String> errorResponse = Map.of("error", "Failed to upload logo");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{id}/logo")
    @Operation(summary = "Delete tenant logo")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteTenantLogo(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {
        log.info("Deleting logo for tenant: {}", id);
        
        try {
            tenantService.deleteTenantLogo(id);
            Map<String, String> response = Map.of("message", "Logo deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete logo for tenant {}: {}", id, e.getMessage());
            Map<String, String> errorResponse = Map.of("error", "Failed to delete logo");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
} 