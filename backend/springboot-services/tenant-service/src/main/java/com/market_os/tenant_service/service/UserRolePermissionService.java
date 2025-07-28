package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.feign.UserRoleServiceClient;
import com.market_os.tenant_service.util.UserContextUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRolePermissionService {
    
    private final UserRoleServiceClient userRoleServiceClient;
    
    /**
     * Get current user's detailed information from UserRoleService
     */
    public AppUserDto getCurrentUserDetails() {
        try {
            Integer userId = UserContextUtil.getCurrentUserIdAsInteger();
            String authHeader = "Bearer " + getCurrentJwtToken();
            
            return userRoleServiceClient.getUserById(userId, authHeader);
        } catch (Exception e) {
            log.error("Failed to get current user details: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Get user's roles for a specific tenant
     */
    public List<UserRoleInfoDto> getUserRolesForTenant(Integer userId, UUID tenantId) {
        try {
            String authHeader = "Bearer " + getCurrentJwtToken();
            // Convert UUID to Integer for the .NET service - assuming tenant IDs are numeric in the UserRoleService
            Integer tenantIdAsInteger = Math.abs(tenantId.hashCode());
            
            return userRoleServiceClient.getUserRoles(userId, tenantIdAsInteger, authHeader);
        } catch (Exception e) {
            log.error("Failed to get user roles for user {} and tenant {}: {}", userId, tenantId, e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Get user's permissions
     */
    public List<PermissionDto> getUserPermissions(Integer userId) {
        try {
            String authHeader = "Bearer " + getCurrentJwtToken();
            
            return userRoleServiceClient.getUserPermissions(userId, authHeader);
        } catch (Exception e) {
            log.error("Failed to get user permissions for user {}: {}", userId, e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Check if current user has a specific permission
     */
    public boolean hasPermission(String permissionName) {
        try {
            Integer userId = UserContextUtil.getCurrentUserIdAsInteger();
            List<PermissionDto> permissions = getUserPermissions(userId);
            
            return permissions.stream()
                    .anyMatch(permission -> permissionName.equals(permission.getName()));
        } catch (Exception e) {
            log.error("Failed to check permission '{}': {}", permissionName, e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if user can manage tenants
     */
    public boolean canManageTenants() {
        // Check if user has SUPER_ADMIN role or ManageTenants permission
        List<String> roles = UserContextUtil.getCurrentUserRoles();
        return roles.contains("SUPER_ADMIN") || hasPermission("ManageTenants");
    }
    
    /**
     * Check if user can access tenant
     */
    public boolean canAccessTenant(UUID tenantId) {
        try {
            // SUPER_ADMIN can access all tenants
            if (UserContextUtil.isSuperAdmin()) {
                return true;
            }
            
            // Check if user's tenant matches the requested tenant
            UUID userTenantId = UserContextUtil.getCurrentUserTenantId();
            if (userTenantId != null && userTenantId.equals(tenantId)) {
                return true;
            }
            
            // Additional check: get user's roles for this specific tenant from UserRoleService
            Integer userId = UserContextUtil.getCurrentUserIdAsInteger();
            List<UserRoleInfoDto> userRoles = getUserRolesForTenant(userId, tenantId);
            
            // If user has any role for this tenant, they can access it
            return !userRoles.isEmpty();
            
        } catch (Exception e) {
            log.error("Failed to check tenant access for tenant {}: {}", tenantId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if user can manage branches for a tenant
     */
    public boolean canManageBranches(UUID tenantId) {
        // Check if user can access the tenant and has branch management permissions
        if (!canAccessTenant(tenantId)) {
            return false;
        }
        
        List<String> roles = UserContextUtil.getCurrentUserRoles();
        return roles.contains("SUPER_ADMIN") || 
               roles.contains("ADMIN") || 
               hasPermission("AddBranch") || 
               hasPermission("EditBranch");
    }
    
    /**
     * Check if user can view branches for a tenant
     */
    public boolean canViewBranches(UUID tenantId) {
        if (!canAccessTenant(tenantId)) {
            return false;
        }
        
        return hasPermission("ViewBranches") || canManageBranches(tenantId);
    }
    
    /**
     * Get current JWT token from request context
     */
    private String getCurrentJwtToken() {
        try {
            return UserContextUtil.getCurrentJwtToken();
        } catch (Exception e) {
            log.warn("Failed to get JWT token from context: {}", e.getMessage());
            return "fallback-token";
        }
    }
} 