package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.SubscriptionStatusDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class SubscriptionServiceFallback implements SubscriptionServiceClient {
    
    @Override
    public SubscriptionStatusDto getTenantSubscriptionStatus(UUID tenantId) {
        log.warn("Subscription service is unavailable for tenant: {}. Returning default inactive status.", tenantId);
        
        return SubscriptionStatusDto.builder()
                .tenantId(tenantId)
                .isActive(false)
                .status("SERVICE_UNAVAILABLE")
                .planName("UNKNOWN")
                .build();
    }
} 