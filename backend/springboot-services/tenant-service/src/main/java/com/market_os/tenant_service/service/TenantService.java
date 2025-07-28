package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TenantService {
    
    /**
     * Create a new tenant
     */
    TenantDto createTenant(CreateTenantDto createTenantDto);
    
    /**
     * Get tenant by ID
     */
    TenantDto getTenantById(UUID id);
    
    /**
     * Get tenant with branches by ID
     */
    TenantWithBranchesDto getTenantWithBranchesById(UUID id);
    
    /**
     * Get all tenants with pagination
     */
    Page<TenantDto> getAllTenants(Pageable pageable);
    
    /**
     * Get all active tenants
     */
    List<TenantDto> getAllActiveTenants();
    
    /**
     * Update tenant
     */
    TenantDto updateTenant(UUID id, UpdateTenantDto updateTenantDto);
    
    /**
     * Delete tenant (soft delete - set isActive to false)
     */
    void deleteTenant(UUID id);
    
    /**
     * Check if tenant exists
     */
    boolean existsById(UUID id);
    
    /**
     * Check if tenant is active via subscription service
     */
    boolean isTenantActiveInSubscriptionService(UUID tenantId);
    
    /**
     * Get tenant subscription status
     */
    SubscriptionStatusDto getTenantSubscriptionStatus(UUID tenantId);
    
    /**
     * Update tenant logo URL
     */
    String updateTenantLogo(UUID tenantId, String logoUrl);
    
    /**
     * Delete tenant logo
     */
    void deleteTenantLogo(UUID tenantId);
} 