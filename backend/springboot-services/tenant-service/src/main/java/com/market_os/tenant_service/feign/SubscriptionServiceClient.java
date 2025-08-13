package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.SubscriptionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
	name = "subscription-service",
	url = "${app.subscription-service.url:http://localhost:5130}",
	fallback = SubscriptionServiceFallback.class
)
public interface SubscriptionServiceClient {

	// Align with .NET route: [Route("api/[controller]")] => /api/subscription
	// GET /api/subscription/{id} returns a single subscription by numeric id
	@GetMapping("/api/subscription/{id}")
	SubscriptionDto getSubscriptionById(@PathVariable("id") Integer id);

	// GET /api/subscription/active returns list of subscriptions
	@GetMapping("/api/subscription/active")
	List<SubscriptionDto> getActiveSubscriptions();
}