package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.dto.events.TenantEvent;
import com.market_os.tenant_service.feign.SubscriptionServiceClient;
import com.market_os.tenant_service.mapper.TenantMapper;
import com.market_os.tenant_service.model.Tenant;
import com.market_os.tenant_service.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TenantServiceImpl implements TenantService {
    
    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;
    private final SubscriptionServiceClient subscriptionServiceClient;
    private final MessagePublisher messagePublisher;
    private final FileStorageService fileStorageService;
    
    @Override
    public TenantDto createTenant(CreateTenantDto createTenantDto) {
        log.info("Creating new tenant with name: {}", createTenantDto.getName());
        
        // Check if tenant name already exists
        if (tenantRepository.existsByNameIgnoreCase(createTenantDto.getName())) {
            throw new IllegalArgumentException("Tenant with name '" + createTenantDto.getName() + "' already exists");
        }
        
        Tenant tenant = tenantMapper.toEntity(createTenantDto);
        Tenant savedTenant = tenantRepository.save(tenant);
        
        // Publish tenant created event
        TenantEvent tenantCreatedEvent = TenantEvent.created(
                savedTenant.getId(),
                savedTenant.getName(),
                savedTenant.getIsActive(),
                savedTenant.getLogoUrl()
        );
        messagePublisher.publishTenantCreated(tenantCreatedEvent);
        
        log.info("Created tenant with ID: {}", savedTenant.getId());
        return tenantMapper.toDto(savedTenant);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TenantDto getTenantById(UUID id) {
        log.info("Fetching tenant with ID: {}", id);
        
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + id));
        
        return tenantMapper.toDto(tenant);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TenantWithBranchesDto getTenantWithBranchesById(UUID id) {
        log.info("Fetching tenant with branches for ID: {}", id);
        
        Tenant tenant = tenantRepository.findByIdWithBranches(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + id));
        
        return tenantMapper.toTenantWithBranchesDto(tenant);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<TenantDto> getAllTenants(Pageable pageable) {
        log.info("Fetching all tenants with pagination");
        
        Page<Tenant> tenants = tenantRepository.findAll(pageable);
        return tenants.map(tenantMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TenantDto> getAllActiveTenants() {
        log.info("Fetching all active tenants");
        
        List<Tenant> activeTenants = tenantRepository.findByIsActiveTrue();
        return tenantMapper.toDtoList(activeTenants);
    }
    
    @Override
    public TenantDto updateTenant(UUID id, UpdateTenantDto updateTenantDto) {
        log.info("Updating tenant with ID: {}", id);
        
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + id));
        
        // Check if the new name already exists for another tenant
        if (updateTenantDto.getName() != null && 
            !updateTenantDto.getName().equalsIgnoreCase(tenant.getName()) &&
            tenantRepository.existsByNameIgnoreCase(updateTenantDto.getName())) {
            throw new IllegalArgumentException("Tenant with name '" + updateTenantDto.getName() + "' already exists");
        }
        
        tenantMapper.updateEntityFromDto(updateTenantDto, tenant);
        Tenant updatedTenant = tenantRepository.save(tenant);
        
        // Publish tenant updated event
        TenantEvent tenantUpdatedEvent = TenantEvent.updated(
                updatedTenant.getId(),
                updatedTenant.getName(),
                updatedTenant.getIsActive(),
                updatedTenant.getLogoUrl()
        );
        messagePublisher.publishTenantUpdated(tenantUpdatedEvent);
        
        log.info("Updated tenant with ID: {}", updatedTenant.getId());
        return tenantMapper.toDto(updatedTenant);
    }
    
    @Override
    public void deleteTenant(UUID id) {
        log.info("Deleting tenant with ID: {}", id);
        
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + id));
        
        // Soft delete - set isActive to false
        String tenantName = tenant.getName();
        tenant.setIsActive(false);
        tenantRepository.save(tenant);
        
        // Publish tenant deleted event
        TenantEvent tenantDeletedEvent = TenantEvent.deleted(id, tenantName);
        messagePublisher.publishTenantDeleted(tenantDeletedEvent);
        
        log.info("Soft deleted tenant with ID: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsById(UUID id) {
        return tenantRepository.existsById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isTenantActiveInSubscriptionService(UUID tenantId) {
        log.info("Checking tenant subscription status for ID: {}", tenantId);
        
        try {
            SubscriptionStatusDto subscriptionStatus = subscriptionServiceClient.getTenantSubscriptionStatus(tenantId);
            return subscriptionStatus.getIsActive();
        } catch (Exception e) {
            log.error("Error checking subscription status for tenant {}: {}", tenantId, e.getMessage());
            return false; // Default to inactive if subscription service is unavailable
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public SubscriptionStatusDto getTenantSubscriptionStatus(UUID tenantId) {
        log.info("Getting subscription status for tenant ID: {}", tenantId);
        
        try {
            return subscriptionServiceClient.getTenantSubscriptionStatus(tenantId);
        } catch (Exception e) {
            log.error("Error getting subscription status for tenant {}: {}", tenantId, e.getMessage());
            throw new RuntimeException("Unable to retrieve subscription status for tenant: " + tenantId, e);
        }
    }
    
    @Override
    public String updateTenantLogo(UUID tenantId, String logoUrl) {
        log.info("Updating logo for tenant ID: {}", tenantId);
        
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + tenantId));
        
        // Delete old logo if exists
        if (tenant.getLogoUrl() != null) {
            try {
                fileStorageService.deleteTenantLogo(tenant.getLogoUrl());
            } catch (Exception e) {
                log.warn("Could not delete old logo file: {}", e.getMessage());
            }
        }
        
        tenant.setLogoUrl(logoUrl);
        Tenant updatedTenant = tenantRepository.save(tenant);
        
        // Publish tenant updated event
        TenantEvent tenantUpdatedEvent = TenantEvent.updated(
                updatedTenant.getId(),
                updatedTenant.getName(),
                updatedTenant.getIsActive(),
                updatedTenant.getLogoUrl()
        );
        messagePublisher.publishTenantUpdated(tenantUpdatedEvent);
        
        log.info("Updated logo for tenant ID: {}", tenantId);
        return updatedTenant.getLogoUrl();
    }
    
    @Override
    public void deleteTenantLogo(UUID tenantId) {
        log.info("Deleting logo for tenant ID: {}", tenantId);
        
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found with ID: " + tenantId));
        
        String oldLogoUrl = tenant.getLogoUrl();
        tenant.setLogoUrl(null);
        Tenant updatedTenant = tenantRepository.save(tenant);
        
        // Publish tenant updated event
        TenantEvent tenantUpdatedEvent = TenantEvent.updated(
                updatedTenant.getId(),
                updatedTenant.getName(),
                updatedTenant.getIsActive(),
                updatedTenant.getLogoUrl()
        );
        messagePublisher.publishTenantUpdated(tenantUpdatedEvent);
        
        log.info("Deleted logo for tenant ID: {}", tenantId);
    }
} 