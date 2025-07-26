package com.market_os.tenant_service.config;

import com.market_os.tenant_service.dto.TokenValidationRequest;
import com.market_os.tenant_service.dto.TokenValidationResponse;
import com.market_os.tenant_service.dto.UserRoleDto;
import com.market_os.tenant_service.feign.TokenValidationClient;
import com.market_os.tenant_service.service.UserTenantMappingService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final TokenValidationClient tokenValidationClient;
    private final UserTenantMappingService userTenantMappingService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // Skip authentication for public endpoints
        String requestPath = request.getRequestURI();
        if (isPublicEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String authorizationHeader = request.getHeader("Authorization");
            
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                
                // Validate token using remote service
                TokenValidationRequest validationRequest = new TokenValidationRequest(token);
                TokenValidationResponse validationResponse = tokenValidationClient.validateToken(validationRequest);
                
                if (validationResponse.isSuccess()) {
                    // Extract user information from validation response claims
                    Map<String, String> claims = validationResponse.getClaims();
                    
                    Integer userIdAsInteger = Integer.parseInt(claims.get("userId"));
                    String email = claims.get("email");
                    String username = email != null ? email.substring(0, email.indexOf("@")) : "unknown";
                    List<String> roles = claims.get("roles") != null ? 
                        Arrays.asList(claims.get("roles").split(",")) : 
                        List.of("USER");
                    
                    // Get tenant ID from user mapping service
                    UUID tenantId = null;
                    try {
                        tenantId = userTenantMappingService.getTenantIdForUser(userIdAsInteger);
                    } catch (Exception e) {
                        log.warn("No tenant mapping found for user ID {}: {}", userIdAsInteger, e.getMessage());
                        // For now, we'll continue without tenant ID
                    }
                    
                    // Create UUID from integer user ID for backward compatibility
                    UUID userId = UUID.nameUUIDFromBytes(userIdAsInteger.toString().getBytes());
                    
                    // Create UserRoleDto from token information
                    UserRoleDto userRole = UserRoleDto.builder()
                            .userId(userId)
                            .username(username)
                            .email(email)
                            .roles(roles)
                            .tenantId(tenantId)
                            .isActive(true)
                            .build();
                    
                    // Create authorities from roles
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .collect(Collectors.toList());
                    
                    // Create authentication token
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            username, 
                            null, 
                            authorities
                    );
                    
                    // Set user info in request attributes for controllers to use
                    request.setAttribute("userId", userId);
                    request.setAttribute("userIdAsInteger", userIdAsInteger);
                    request.setAttribute("userRoles", roles);
                    request.setAttribute("tenantId", tenantId);
                    request.setAttribute("userInfo", userRole);
                    request.setAttribute("jwtToken", token);
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Authenticated user: {} (ID: {}) with roles: {} and tenant: {}", 
                            username, userIdAsInteger, roles, tenantId);
                } else {
                    log.warn("Token validation failed for request to {}: {}", requestPath, validationResponse.getMessage());
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } else {
                log.warn("Missing Authorization header in request to: {}", requestPath);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } catch (Exception e) {
            log.error("Authentication error: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/actuator/") ||
               path.startsWith("/api-docs") ||
               path.startsWith("/swagger-ui/") ||
               path.equals("/swagger-ui.html") ||
               path.startsWith("/v3/api-docs/") ||
               path.equals("/health");
    }
} 