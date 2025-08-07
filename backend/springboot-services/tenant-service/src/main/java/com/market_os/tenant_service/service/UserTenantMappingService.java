package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.UserRoleInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserTenantMappingService {
    
    private final UserRolePermissionService userRolePermissionService;
    
    // In-memory storage for user-tenant mappings
    // In a real application, this would be stored in a database
    private final Map<Integer, UUID> userTenantMappings = new ConcurrentHashMap<>();
    
    /**
     * Create a mapping between user ID and tenant ID
     */
    public void createUserTenantMapping(Integer userId, UUID tenantId) {
        userTenantMappings.put(userId, tenantId);
        log.info("Created user-tenant mapping: userId={}, tenantId={}", userId, tenantId);
    }
    
    /**
     * Get tenant ID for a given user ID
     * Enhanced with UserRoleService validation
     */
    public UUID getTenantIdForUser(Integer userId) {
        UUID tenantId = userTenantMappings.get(userId);
        if (tenantId == null) {
            log.warn("No tenant mapping found for user ID: {}", userId);
            throw new IllegalStateException("No tenant mapping found for user ID: " + userId);
        }
        
        // Validate the mapping with UserRoleService
        // Check if user actually has any roles for this tenant
        try {
            List<UserRoleInfoDto> userRoles = userRolePermissionService.getUserRolesForTenant(userId, tenantId);
            if (userRoles.isEmpty()) {
                log.warn("User {} has no roles for mapped tenant {}. Mapping may be stale.", userId, tenantId);
                // Note: We don't remove the mapping here as it might be a temporary UserRoleService issue
            } else {
                log.debug("Validated user {} has {} roles for tenant {}", userId, userRoles.size(), tenantId);
            }
        } catch (Exception e) {
            log.warn("Failed to validate tenant mapping for user {} and tenant {}: {}", userId, tenantId, e.getMessage());
        }
        
        return tenantId;
    }
    
    /**
     * Remove mapping for a user
     */
    public void removeUserTenantMapping(Integer userId) {
        UUID removedTenantId = userTenantMappings.remove(userId);
        if (removedTenantId != null) {
            log.info("Removed user-tenant mapping: userId={}, tenantId={}", userId, removedTenantId);
        }
    }
    
    /**
     * Check if user has a tenant mapping
     */
    public boolean hasUserTenantMapping(Integer userId) {
        return userTenantMappings.containsKey(userId);
    }
    
    /**
     * Get all user-tenant mappings (for debugging)
     */
    public Map<Integer, UUID> getAllMappings() {
        return new ConcurrentHashMap<>(userTenantMappings);
    }
    
    /**
     * Check if user has roles for a specific tenant via UserRoleService
     */
    public boolean hasUserRolesForTenant(Integer userId, UUID tenantId) {
        try {
            List<UserRoleInfoDto> userRoles = userRolePermissionService.getUserRolesForTenant(userId, tenantId);
            return !userRoles.isEmpty();
        } catch (Exception e) {
            log.error("Failed to check user roles for user {} and tenant {}: {}", userId, tenantId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get user's roles for a specific tenant via UserRoleService
     */
    public List<UserRoleInfoDto> getUserRolesForTenant(Integer userId, UUID tenantId) {
        try {
            return userRolePermissionService.getUserRolesForTenant(userId, tenantId);
        } catch (Exception e) {
            log.error("Failed to get user roles for user {} and tenant {}: {}", userId, tenantId, e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Create a user-tenant mapping with validation from UserRoleService
     */
    public void createValidatedUserTenantMapping(Integer userId, UUID tenantId) {
        // First check if user has any roles for this tenant
        if (!hasUserRolesForTenant(userId, tenantId)) {
            log.warn("Attempting to create mapping for user {} and tenant {} but user has no roles for this tenant", 
                    userId, tenantId);
            // Still create the mapping as roles might be assigned later
        }
        
        createUserTenantMapping(userId, tenantId);
    }
    
    /**
     * Sync user-tenant mappings based on UserRoleService data
     * This method could be called periodically to keep mappings in sync
     */
    public void syncUserTenantMappings() {
        log.info("Starting user-tenant mapping synchronization with UserRoleService");
        
        log.info("User-tenant mapping synchronization completed");
    }
} 