package com.market_os.tenant_service.controller;

import com.market_os.tenant_service.service.UserTenantMappingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User-Tenant Mapping", description = "API for managing user-tenant mappings")
public class UserTenantMappingController {

    private final UserTenantMappingService userTenantMappingService;

    @PostMapping("/{userId}/tenant/{tenantId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Assign user to tenant", description = "Creates a mapping between a user and tenant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully assigned to tenant"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID or tenant ID"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "409", description = "User already assigned to a tenant")
    })
    public ResponseEntity<String> assignUserToTenant(
            @Parameter(description = "User ID from .NET service", required = true)
            @PathVariable Integer userId,
            @Parameter(description = "Tenant ID to assign user to", required = true)
            @PathVariable UUID tenantId) {
        
        try {
            // Check if user already has a tenant mapping
            if (userTenantMappingService.hasUserTenantMapping(userId)) {
                log.warn("User {} already has a tenant mapping", userId);
                return ResponseEntity.status(409).body("User already assigned to a tenant");
            }

            userTenantMappingService.createUserTenantMapping(userId, tenantId);
            log.info("Successfully assigned user {} to tenant {}", userId, tenantId);
            return ResponseEntity.ok("User successfully assigned to tenant");
            
        } catch (Exception e) {
            log.error("Failed to assign user {} to tenant {}: {}", userId, tenantId, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to assign user to tenant: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Get user's tenant", description = "Retrieves the tenant ID for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tenant found"),
            @ApiResponse(responseCode = "404", description = "User has no tenant mapping"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Map<String, Object>> getUserTenant(
            @Parameter(description = "User ID from .NET service", required = true)
            @PathVariable Integer userId) {
        
        try {
            UUID tenantId = userTenantMappingService.getTenantIdForUser(userId);
            Map<String, Object> response = Map.of(
                    "userId", userId,
                    "tenantId", tenantId
            );
            return ResponseEntity.ok(response);
            
        } catch (IllegalStateException e) {
            log.warn("No tenant mapping found for user {}", userId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to get tenant for user {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}/tenant")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Remove user from tenant", description = "Removes the mapping between a user and tenant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully removed from tenant"),
            @ApiResponse(responseCode = "404", description = "User has no tenant mapping"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<String> removeUserFromTenant(
            @Parameter(description = "User ID from .NET service", required = true)
            @PathVariable Integer userId) {
        
        try {
            if (!userTenantMappingService.hasUserTenantMapping(userId)) {
                log.warn("No tenant mapping found for user {}", userId);
                return ResponseEntity.notFound().build();
            }

            userTenantMappingService.removeUserTenantMapping(userId);
            log.info("Successfully removed user {} from tenant", userId);
            return ResponseEntity.ok("User successfully removed from tenant");
            
        } catch (Exception e) {
            log.error("Failed to remove user {} from tenant: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to remove user from tenant: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/tenant/{tenantId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
    @Operation(summary = "Update user's tenant", description = "Updates the tenant mapping for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User's tenant successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID or tenant ID"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User has no existing tenant mapping")
    })
    public ResponseEntity<String> updateUserTenant(
            @Parameter(description = "User ID from .NET service", required = true)
            @PathVariable Integer userId,
            @Parameter(description = "New tenant ID to assign user to", required = true)
            @PathVariable UUID tenantId) {
        
        try {
            if (!userTenantMappingService.hasUserTenantMapping(userId)) {
                log.warn("No existing tenant mapping found for user {}", userId);
                return ResponseEntity.notFound().build();
            }

            userTenantMappingService.createUserTenantMapping(userId, tenantId); // This will overwrite existing mapping
            log.info("Successfully updated user {} to tenant {}", userId, tenantId);
            return ResponseEntity.ok("User's tenant successfully updated");
            
        } catch (Exception e) {
            log.error("Failed to update user {} to tenant {}: {}", userId, tenantId, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update user's tenant: " + e.getMessage());
        }
    }

    @GetMapping("/mappings")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all user-tenant mappings", description = "Retrieves all user-tenant mappings (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mappings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<Map<Integer, UUID>> getAllMappings() {
        try {
            Map<Integer, UUID> mappings = userTenantMappingService.getAllMappings();
            log.info("Retrieved {} user-tenant mappings", mappings.size());
            return ResponseEntity.ok(mappings);
            
        } catch (Exception e) {
            log.error("Failed to retrieve user-tenant mappings: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
} 