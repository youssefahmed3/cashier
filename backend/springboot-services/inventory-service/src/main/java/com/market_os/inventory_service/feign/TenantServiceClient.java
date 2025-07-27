package com.market_os.inventory_service.feign;

import com.market_os.inventory_service.dto.TenantDto;
import com.market_os.inventory_service.dto.BranchDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
    name = "tenant-service",
    url = "${app.tenant-service.url}",
    fallback = TenantServiceFallback.class
)
public interface TenantServiceClient {
    
    @GetMapping("/tenants/{id}")
    TenantDto getTenantById(@PathVariable Long id);
    
    @GetMapping("/tenants")
    List<TenantDto> getAllTenants();
    
    @GetMapping("/branches/{id}")
    BranchDto getBranchById(@PathVariable Long id);
    
    @GetMapping("/tenants/{tenantId}/branches")
    List<BranchDto> getBranchesByTenantId(@PathVariable Long tenantId);
} 