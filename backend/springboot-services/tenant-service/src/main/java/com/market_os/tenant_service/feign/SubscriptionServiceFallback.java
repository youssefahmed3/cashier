package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.SubscriptionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@Slf4j
public class SubscriptionServiceFallback implements SubscriptionServiceClient {

	@Override
	public SubscriptionDto getSubscriptionById(Integer id) {
		log.warn("Subscription service is unavailable for getSubscriptionById({}). Returning null.", id);
		return null;
	}

	@Override
	public List<SubscriptionDto> getActiveSubscriptions() {
		log.warn("Subscription service is unavailable for getActiveSubscriptions(). Returning empty list.");
		return Collections.emptyList();
	}
}