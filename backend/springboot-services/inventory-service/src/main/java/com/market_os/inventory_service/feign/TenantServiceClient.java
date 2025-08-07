package com.market_os.inventory_service.feign;

import com.market_os.inventory_service.config.FeignConfig;
import com.market_os.inventory_service.dto.TenantDto;
import com.market_os.inventory_service.dto.BranchDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
    name = "tenant-service",
    url = "${app.tenant-service.url}",
    fallback = TenantServiceFallback.class,
    configuration = FeignConfig.class
)
public interface TenantServiceClient {
    
    @GetMapping("/api/v1/tenants/{id}")
    TenantDto getTenantById(@PathVariable String id);
    
    @GetMapping("/api/v1/tenants")
    List<TenantDto> getAllTenants();
    
    @GetMapping("/api/v1/branches/{id}")
    BranchDto getBranchById(@PathVariable String id);
    
    @GetMapping("/api/v1/tenants/{tenantId}/branches")
    List<BranchDto> getBranchesByTenantId(@PathVariable String tenantId);
} 