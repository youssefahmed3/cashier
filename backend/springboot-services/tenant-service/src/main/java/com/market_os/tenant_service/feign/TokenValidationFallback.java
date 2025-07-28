package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.TokenValidationRequest;
import com.market_os.tenant_service.dto.TokenValidationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TokenValidationFallback implements TokenValidationClient {
    
    @Override
    public TokenValidationResponse validateToken(TokenValidationRequest request) {
        log.error("Token validation service is unavailable, falling back to failure response");
        return new TokenValidationResponse(
            false, 
            "Token validation service is temporarily unavailable", 
            null
        );
    }
} 