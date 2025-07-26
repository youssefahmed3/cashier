package com.market_os.tenant_service.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Slf4j
public class JwtUtil {

    @Value("${app.jwt.secret:mySecretKey}")
    private String secretKey;

    @Value("${app.jwt.issuer:https://localhost:5115}")
    private String issuer;

    @Value("${app.jwt.audience:https://localhost:5115}")
    private String audience;

    /**
     * Parse JWT token and extract claims
     */
    public Claims parseToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .requireIssuer(issuer)
                    .requireAudience(audience)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("Failed to parse JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    /**
     * Extract user ID from JWT token
     */
    public UUID getUserId(String token) {
        Claims claims = parseToken(token);
        String userIdStr = claims.getSubject(); // NameIdentifier claim
        return UUID.fromString(userIdStr);
    }
    
    /**
     * Extract user ID as integer from JWT token (for .NET service compatibility)
     */
    public Integer getUserIdAsInteger(String token) {
        Claims claims = parseToken(token);
        String userIdStr = claims.getSubject(); // NameIdentifier claim
        try {
            return Integer.parseInt(userIdStr);
        } catch (NumberFormatException e) {
            log.error("Failed to parse user ID as integer: {}", userIdStr);
            throw new RuntimeException("Invalid user ID format in JWT token", e);
        }
    }

    /**
     * Extract email from JWT token
     */
    public String getEmail(String token) {
        Claims claims = parseToken(token);
        return claims.get("email", String.class);
    }

    /**
     * Extract roles from JWT token
     */
    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        Claims claims = parseToken(token);
        Object rolesObj = claims.get("http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
        
        if (rolesObj instanceof List) {
            return (List<String>) rolesObj;
        } else if (rolesObj instanceof String) {
            return List.of((String) rolesObj);
        }
        
        return List.of("USER"); // Default role
    }

    /**
     * Extract username from JWT token
     */
    public String getUsername(String token) {
        Claims claims = parseToken(token);
        String email = getEmail(token);
        return email != null ? email.substring(0, email.indexOf("@")) : "unknown";
    }

    /**
     * Check if token is valid
     */
    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
} 