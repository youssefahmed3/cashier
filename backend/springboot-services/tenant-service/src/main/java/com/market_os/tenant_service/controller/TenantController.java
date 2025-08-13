package com.market_os.tenant_service.controller;

import com.market_os.tenant_service.dto.*;
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
        // Get user roles from request attributes (set by JwtAuthenticationFilter)
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Creating tenant: {} with roles: {}",
                createTenantDto.getName(), currentUserRoles);

        // For SUPER_ADMIN, only check role - no user ID required as discussed
        if (!currentUserRoles.contains("SUPER_ADMIN")) {
            log.warn("Non-SUPER_ADMIN user attempted to create tenant with roles: {}", currentUserRoles);
            throw new AccessDeniedException("Only SUPER_ADMIN can create tenants");
        }

        TenantDto createdTenant = tenantService.createTenant(createTenantDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tenant by ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<TenantDto> getTenantById(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting tenant: {} with roles: {}", id, currentUserRoles);

        // For SUPER_ADMIN, allow access to any tenant
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            TenantDto tenant = tenantService.getTenantById(id);
            return ResponseEntity.ok(tenant);
        }

        // For other roles, check tenant access through UserRoleService
        if (!userContextService.canAccessTenant(id)) {
            log.warn("User attempted to access tenant {} without permission", id);
            throw new AccessDeniedException("You don't have permission to access this tenant");
        }

        TenantDto tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok(tenant);
    }

    @GetMapping("/{id}/with-branches")
    @Operation(summary = "Get tenant with branches by ID")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<TenantWithBranchesDto> getTenantWithBranchesById(
            @Parameter(description = "Tenant ID") @PathVariable UUID id) {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting tenant with branches: {} with roles: {}", id, currentUserRoles);

        // For SUPER_ADMIN, allow access to any tenant with branches
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            TenantWithBranchesDto tenant = tenantService.getTenantWithBranchesById(id);
            return ResponseEntity.ok(tenant);
        }

        // Temporary bypass for debugging - remove this in production
        if (currentUserRoles.contains("ADMIN")) {
            log.warn("Temporarily bypassing tenant access check for ADMIN user");
            TenantWithBranchesDto tenant = tenantService.getTenantWithBranchesById(id);
            return ResponseEntity.ok(tenant);
        }

        // For other roles, check tenant access through UserRoleService
        if (!userContextService.canAccessTenant(id)) {
            log.warn("User attempted to get tenant with branches {} without permission", id);
            throw new AccessDeniedException("You don't have permission to access this tenant");
        }

        TenantWithBranchesDto tenant = tenantService.getTenantWithBranchesById(id);
        return ResponseEntity.ok(tenant);
    }

    @GetMapping
    @Operation(summary = "Get all tenants with pagination")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<TenantDto>> getAllTenants(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting all tenants with pagination with roles: {}", currentUserRoles);

        // For SUPER_ADMIN, only check role - no user ID required
        if (!currentUserRoles.contains("SUPER_ADMIN")) {
            log.warn("Non-SUPER_ADMIN user attempted to access all tenants with roles: {}", currentUserRoles);
            throw new AccessDeniedException("Only SUPER_ADMIN can view all tenants");
        }

        Page<TenantDto> tenants = tenantService.getAllTenants(pageable);
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active tenants")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<TenantDto>> getAllActiveTenants() {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting all active tenants with roles: {}", currentUserRoles);

        // For SUPER_ADMIN, return all active tenants
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            List<TenantDto> activeTenants = tenantService.getAllActiveTenants();
            return ResponseEntity.ok(activeTenants);
        }

        // For other roles, this endpoint might need filtering based on user's tenant
        // access
        // For now, we'll return all active tenants, but in a real implementation,
        // you might want to filter based on the user's organization or region
        List<TenantDto> activeTenants = tenantService.getAllActiveTenants();
        return ResponseEntity.ok(activeTenants);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantDto> updateTenant(
            @Parameter(description = "Tenant ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateTenantDto updateTenantDto) {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Updating tenant: {} with roles: {}", id, currentUserRoles);

        // For SUPER_ADMIN, only check role - no user ID required
        if (!currentUserRoles.contains("SUPER_ADMIN")) {
            log.warn("Non-SUPER_ADMIN user attempted to update tenant {} with roles: {}", id, currentUserRoles);
            throw new AccessDeniedException("Only SUPER_ADMIN can update tenants");
        }

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

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Getting subscription status for tenant: {} with roles: {}", id, currentUserRoles);

        // For SUPER_ADMIN, allow access to any tenant's subscription status
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            SubscriptionStatusDto subscriptionStatus = tenantService.getTenantSubscriptionStatus(id);
            return ResponseEntity.ok(subscriptionStatus);
        }

        // For other roles, check tenant access through UserRoleService
        if (!userContextService.canAccessTenant(id)) {
            log.warn("User attempted to get subscription status for tenant {} without permission", id);
            throw new AccessDeniedException("You don't have permission to access this tenant's subscription status");
        }

        SubscriptionStatusDto subscriptionStatus = tenantService.getTenantSubscriptionStatus(id);
        return ResponseEntity.ok(subscriptionStatus);
    }

    @GetMapping("/subscription-plans")
    @Operation(summary = "Get available subscription plans (proxy to subscription-service)")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<List<SubscriptionDto>> getSubscriptionPlans() {
        List<SubscriptionDto> plans = tenantService.getActiveSubscriptionPlans();
        return ResponseEntity.ok(plans);
    }

    @PostMapping("/{id}/subscribe")
    @Operation(summary = "Subscribe/activate a plan for a tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<SubscriptionStatusDto> subscribeTenant(
            @Parameter(description = "Tenant ID") @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {

        // planId is sent from FE; map or create/activate in subscription-service
        Integer planId = null;
        if (body != null && body.get("planId") != null) {
            try { planId = Integer.valueOf(body.get("planId").toString()); } catch (Exception ignored) {}
        }

        SubscriptionStatusDto status = tenantService.subscribeTenantToPlan(id, planId);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/{id}/logo")
    @Operation(summary = "Upload tenant logo")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadTenantLogo(
            @Parameter(description = "Tenant ID") @PathVariable UUID id,
            @Parameter(description = "Logo file") @RequestParam("logo") MultipartFile file) {

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Uploading logo for tenant: {} with roles: {}", id, currentUserRoles);

        // For SUPER_ADMIN, allow uploading logo for any tenant
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            // Validate tenant exists
            if (!tenantService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
        } else {
            // For other roles, check tenant access through UserRoleService
            if (!userContextService.canUpdateTenant(id)) {
                log.warn("User attempted to upload logo for tenant {} without permission", id);
                throw new AccessDeniedException("You don't have permission to upload logo for this tenant");
            }

            // Validate tenant exists
            if (!tenantService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
        }

        try {
            String logoUrl = fileStorageService.storeTenantLogo(id, file);
            String updatedLogoUrl = tenantService.updateTenantLogo(id, logoUrl);

            Map<String, String> response = Map.of(
                    "message", "Logo uploaded successfully",
                    "logo_url", updatedLogoUrl);

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

        // Get user roles from request attributes
        List<String> currentUserRoles = UserContextUtil.getCurrentUserRoles();

        log.info("Deleting logo for tenant: {} with roles: {}", id, currentUserRoles);

        // For SUPER_ADMIN, allow deleting logo for any tenant
        if (currentUserRoles.contains("SUPER_ADMIN")) {
            // Validate tenant exists
            if (!tenantService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
        } else {
            // For other roles, check tenant access through UserRoleService
            if (!userContextService.canUpdateTenant(id)) {
                log.warn("User attempted to delete logo for tenant {} without permission", id);
                throw new AccessDeniedException("You don't have permission to delete logo for this tenant");
            }

            // Validate tenant exists
            if (!tenantService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
        }

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