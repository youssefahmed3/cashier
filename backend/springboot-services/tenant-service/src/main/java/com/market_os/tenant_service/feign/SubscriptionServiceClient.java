package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.SubscriptionStatusDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
    name = "subscription-service",
    url = "${app.subscription-service.url:http://localhost:8082}",
    fallback = SubscriptionServiceFallback.class
)
public interface SubscriptionServiceClient {
    
    @GetMapping("/subscriptions/{tenantId}/status")
    SubscriptionStatusDto getTenantSubscriptionStatus(@PathVariable("tenantId") UUID tenantId);
} 