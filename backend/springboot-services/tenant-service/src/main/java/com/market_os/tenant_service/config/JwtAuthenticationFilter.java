package com.market_os.tenant_service.config;

import com.market_os.tenant_service.dto.UserRoleDto;
import com.market_os.tenant_service.service.UserTenantMappingService;
import com.market_os.tenant_service.util.JwtUtil;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
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
                
                // Validate token
                if (jwtUtil.isTokenValid(token)) {
                    // Extract user information from JWT token
                    Integer userIdAsInteger = jwtUtil.getUserIdAsInteger(token);
                    String email = jwtUtil.getEmail(token);
                    String username = jwtUtil.getUsername(token);
                    List<String> roles = jwtUtil.getRoles(token);
                    
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
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Authenticated user: {} (ID: {}) with roles: {} and tenant: {}", 
                            username, userIdAsInteger, roles, tenantId);
                } else {
                    log.warn("Invalid JWT token in request to: {}", requestPath);
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