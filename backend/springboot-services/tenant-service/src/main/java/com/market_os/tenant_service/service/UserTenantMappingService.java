package com.market_os.tenant_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserTenantMappingService {
    
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
     */
    public UUID getTenantIdForUser(Integer userId) {
        UUID tenantId = userTenantMappings.get(userId);
        if (tenantId == null) {
            log.warn("No tenant mapping found for user ID: {}", userId);
            throw new IllegalStateException("No tenant mapping found for user ID: " + userId);
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
} 