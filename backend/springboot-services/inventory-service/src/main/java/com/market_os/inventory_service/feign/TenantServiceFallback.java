package com.market_os.inventory_service.feign;

import com.market_os.inventory_service.dto.TenantDto;
import com.market_os.inventory_service.dto.BranchDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class TenantServiceFallback implements TenantServiceClient {
    
    @Override
    public TenantDto getTenantById(Long id) {
        log.error("Tenant service is unavailable, falling back to null for tenant ID: {}", id);
        return null;
    }
    
    @Override
    public List<TenantDto> getAllTenants() {
        log.error("Tenant service is unavailable, falling back to empty list for all tenants");
        return new ArrayList<>();
    }
    
    @Override
    public BranchDto getBranchById(Long id) {
        log.error("Tenant service is unavailable, falling back to null for branch ID: {}", id);
        return null;
    }
    
    @Override
    public List<BranchDto> getBranchesByTenantId(Long tenantId) {
        log.error("Tenant service is unavailable, falling back to empty list for tenant ID: {}", tenantId);
        return new ArrayList<>();
    }
} 