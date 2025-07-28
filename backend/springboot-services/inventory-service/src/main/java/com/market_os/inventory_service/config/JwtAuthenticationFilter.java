package com.market_os.inventory_service.config;

import com.market_os.inventory_service.dto.TokenValidationRequest;
import com.market_os.inventory_service.dto.TokenValidationResponse;
import com.market_os.inventory_service.feign.TokenValidationClient;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenValidationClient tokenValidationClient;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String token = extractTokenFromRequest(request);
            
            if (StringUtils.hasText(token)) {
                TokenValidationRequest validationRequest = new TokenValidationRequest(token);
                TokenValidationResponse validationResponse = tokenValidationClient.validateToken(validationRequest);
                
                if (validationResponse.isSuccess() && validationResponse.getClaims() != null) {
                    String userId = validationResponse.getClaims().get("userId");
                    String email = validationResponse.getClaims().get("email");
                    String roles = validationResponse.getClaims().get("roles");
                    
                    if (StringUtils.hasText(userId) && StringUtils.hasText(email)) {
                        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                        
                        if (StringUtils.hasText(roles)) {
                            authorities = List.of(roles.split(","))
                                    .stream()
                                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.trim()))
                                    .collect(Collectors.toList());
                        }
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.debug("Authenticated user: {} with roles: {}", email, authorities);
                    }
                } else {
                    log.warn("Token validation failed: {}", validationResponse.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error processing JWT token", e);
        }
        
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 