package com.market_os.inventory_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@Slf4j
public class FeignConfig {

    @Bean
    public RequestInterceptor jwtAuthInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                try {
                    ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                    if (attributes != null) {
                        HttpServletRequest request = attributes.getRequest();
                        String token = extractTokenFromRequest(request);
                        if (token != null) {
                            template.header("Authorization", "Bearer " + token);
                            log.debug("Added JWT token to Feign request: {}", template.url());
                        } else {
                            log.warn("No JWT token found in request context for Feign call to: {}", template.url());
                        }
                    } else {
                        log.warn("No request context available for Feign call to: {}", template.url());
                    }
                } catch (Exception e) {
                    log.error("Error adding JWT token to Feign request: {}", e.getMessage());
                }
            }
        };
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 