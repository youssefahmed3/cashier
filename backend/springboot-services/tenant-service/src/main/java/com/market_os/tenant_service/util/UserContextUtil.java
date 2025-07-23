package com.market_os.tenant_service.util;

import com.market_os.tenant_service.dto.UserRoleDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.UUID;

@UtilityClass
@Slf4j
public class UserContextUtil {
    
    /**
     * Get the current user ID from request attributes
     * Set by JwtAuthenticationFilter
     */
    public static UUID getCurrentUserId() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            UUID userId = (UUID) request.getAttribute("userId");
            if (userId != null) {
                return userId;
            }
        }
        throw new IllegalStateException("User ID not found in request context");
    }
    
    /**
     * Get the current user ID as integer from request attributes
     * Set by JwtAuthenticationFilter (for .NET service compatibility)
     */
    public static Integer getCurrentUserIdAsInteger() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            Integer userId = (Integer) request.getAttribute("userIdAsInteger");
            if (userId != null) {
                return userId;
            }
        }
        throw new IllegalStateException("User ID as integer not found in request context");
    }
    
    /**
     * Get the current user's roles from request attributes
     * Set by JwtAuthenticationFilter
     */
    @SuppressWarnings("unchecked")
    public static List<String> getCurrentUserRoles() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            List<String> roles = (List<String>) request.getAttribute("userRoles");
            if (roles != null) {
                return roles;
            }
        }
        throw new IllegalStateException("User roles not found in request context");
    }
    
    /**
     * Get the current user's tenant ID from request attributes
     * Set by JwtAuthenticationFilter
     */
    public static UUID getCurrentUserTenantId() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            UUID tenantId = (UUID) request.getAttribute("tenantId");
            if (tenantId != null) {
                return tenantId;
            }
        }
        // Return null if user doesn't have a tenant (e.g., SUPER_ADMIN)
        return null;
    }
    
    /**
     * Get the complete user info from request attributes
     * Set by JwtAuthenticationFilter
     */
    public static UserRoleDto getCurrentUserInfo() {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            UserRoleDto userInfo = (UserRoleDto) request.getAttribute("userInfo");
            if (userInfo != null) {
                return userInfo;
            }
        }
        throw new IllegalStateException("User info not found in request context");
    }
    
    /**
     * Check if current user has a specific role
     */
    public static boolean hasRole(String role) {
        try {
            List<String> roles = getCurrentUserRoles();
            return roles.contains(role);
        } catch (Exception e) {
            log.warn("Failed to check user role: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if current user is SUPER_ADMIN
     */
    public static boolean isSuperAdmin() {
        return hasRole("SUPER_ADMIN");
    }
    
    /**
     * Check if current user is ADMIN
     */
    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }
    
    /**
     * Check if current user has access to a specific tenant
     * SUPER_ADMIN can access all tenants
     * Other users can only access their own tenant
     */
    public static boolean hasAccessToTenant(UUID tenantId) {
        if (isSuperAdmin()) {
            return true;
        }
        
        UUID userTenantId = getCurrentUserTenantId();
        return userTenantId != null && userTenantId.equals(tenantId);
    }
    
    /**
     * Get current HttpServletRequest
     */
    private static HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes requestAttributes = 
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return requestAttributes != null ? requestAttributes.getRequest() : null;
    }
} 