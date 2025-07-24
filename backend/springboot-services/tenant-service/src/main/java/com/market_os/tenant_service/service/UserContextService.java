package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.UserRoleDto;
import com.market_os.tenant_service.dto.AppUserDto;
import com.market_os.tenant_service.dto.PermissionDto;
import com.market_os.tenant_service.util.UserContextUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserContextService {
    
    private final UserRolePermissionService userRolePermissionService;
    
    /**
     * Get current user's tenant ID
     * Uses cached value from request context (set by JwtAuthenticationFilter)
     */
    public UUID getCurrentUserTenantId() {
        try {
            // Get from request context (set by JwtAuthenticationFilter)
            UUID tenantId = UserContextUtil.getCurrentUserTenantId();
            if (tenantId != null) {
                return tenantId;
            }
            
            // For users without tenant assignment (e.g., SUPER_ADMIN), return null
            return null;
        } catch (Exception e) {
            log.debug("Could not determine user tenant ID: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Get current user's roles
     * Uses cached value from request context (set by JwtAuthenticationFilter)
     */
    public List<String> getCurrentUserRoles() {
        try {
            // Get from request context (set by JwtAuthenticationFilter)
            return UserContextUtil.getCurrentUserRoles();
        } catch (Exception e) {
            log.debug("Could not determine user roles: {}", e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Check if current user has permission to access a tenant
     * Enhanced with UserRoleService integration
     */
    public boolean canAccessTenant(UUID tenantId) {
        try {
            // Check using enhanced permission service
            boolean hasAccess = userRolePermissionService.canAccessTenant(tenantId);
            
            // Additional business logic checks
            if (hasAccess) {
                // Check if user is suspended
                AppUserDto userDetails = userRolePermissionService.getCurrentUserDetails();
                if (userDetails != null && Boolean.TRUE.equals(userDetails.getIsSuspended())) {
                    log.warn("Access denied for suspended user to tenant: {}", tenantId);
                    return false;
                }
                
                // Check if user has ViewTenants permission
                if (!userRolePermissionService.hasPermission("ViewTenants") && 
                    !UserContextUtil.isSuperAdmin()) {
                    log.warn("User lacks ViewTenants permission for tenant: {}", tenantId);
                    return false;
                }
            }
            
            return hasAccess;
        } catch (Exception e) {
            log.warn("Error checking tenant access: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if current user has permission to perform a specific action
     * This method provides fine-grained permission control
     */
    public boolean hasPermission(String action, UUID tenantId) {
        try {
            // Basic role-based check
            List<String> roles = getCurrentUserRoles();
            
            // SUPER_ADMIN can do everything
            if (roles.contains("SUPER_ADMIN")) {
                return true;
            }
            
            // Check tenant access first
            if (!canAccessTenant(tenantId)) {
                return false;
            }
            
            // Action-specific permissions based on roles
            return switch (action) {
                case "CREATE_TENANT", "DELETE_TENANT" -> roles.contains("SUPER_ADMIN");
                case "UPDATE_TENANT", "CREATE_BRANCH", "UPDATE_BRANCH" -> 
                    roles.contains("SUPER_ADMIN") || roles.contains("ADMIN");
                case "VIEW_TENANT", "VIEW_BRANCH" -> 
                    roles.contains("SUPER_ADMIN") || roles.contains("ADMIN") || roles.contains("USER");
                default -> false;
            };
            
        } catch (Exception e) {
            log.warn("Error checking permission for action {}: {}", action, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get user information for audit logging
     */
    public String getUserAuditInfo() {
        try {
            UUID userId = UserContextUtil.getCurrentUserId();
            UUID tenantId = UserContextUtil.getCurrentUserTenantId();
            List<String> roles = UserContextUtil.getCurrentUserRoles();
            
            return String.format("User: %s, Tenant: %s, Roles: %s", 
                    userId, tenantId, roles);
        } catch (Exception e) {
            return "User: unknown";
        }
    }
    
    /**
     * Check if user can create tenants
     */
    public boolean canCreateTenants() {
        return userRolePermissionService.canManageTenants() && 
               userRolePermissionService.hasPermission("ManageTenants");
    }
    
    /**
     * Check if user can update a specific tenant
     */
    public boolean canUpdateTenant(UUID tenantId) {
        return canAccessTenant(tenantId) && 
               (UserContextUtil.isSuperAdmin() || 
                userRolePermissionService.hasPermission("ManageTenants"));
    }
    
    /**
     * Check if user can delete a specific tenant
     */
    public boolean canDeleteTenant(UUID tenantId) {
        return UserContextUtil.isSuperAdmin() && 
               userRolePermissionService.hasPermission("ManageTenants");
    }
    
    /**
     * Check if user can create branches for a tenant
     */
    public boolean canCreateBranches(UUID tenantId) {
        return userRolePermissionService.canManageBranches(tenantId);
    }
    
    /**
     * Check if user can view branches for a tenant
     */
    public boolean canViewBranches(UUID tenantId) {
        return userRolePermissionService.canViewBranches(tenantId);
    }
    
    /**
     * Get detailed user information from UserRoleService
     */
    public AppUserDto getCurrentUserDetails() {
        return userRolePermissionService.getCurrentUserDetails();
    }
    
    /**
     * Get current user's permissions
     */
    public List<PermissionDto> getCurrentUserPermissions() {
        try {
            Integer userId = UserContextUtil.getCurrentUserIdAsInteger();
            return userRolePermissionService.getUserPermissions(userId);
        } catch (Exception e) {
            log.error("Failed to get current user permissions: {}", e.getMessage());
            return List.of();
        }
    }
} 