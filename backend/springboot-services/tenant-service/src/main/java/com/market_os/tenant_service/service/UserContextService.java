package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.UserRoleDto;
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
     * This method can be enhanced with complex business logic
     */
    public boolean canAccessTenant(UUID tenantId) {
        try {
            // Check using utility method
            boolean hasAccess = UserContextUtil.hasAccessToTenant(tenantId);
            
            // TODO: Add additional checks when needed
            // - Check if user's subscription allows access to this tenant
            // - Validate time-based access restrictions
            // - Check if tenant is active and user has current permissions
            // - Apply business rules based on user roles
            
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
} 