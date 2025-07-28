package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.TokenValidationRequest;
import com.market_os.tenant_service.dto.TokenValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "token-validation-service",
    url = "${app.user-role-service.url}",
    fallback = TokenValidationFallback.class
)
public interface TokenValidationClient {
    
    @PostMapping("/api/token/validate")
    TokenValidationResponse validateToken(@RequestBody TokenValidationRequest request);
} 