package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.AppUserDto;
import com.market_os.tenant_service.dto.AppRoleDto;
import com.market_os.tenant_service.dto.UserRoleInfoDto;
import com.market_os.tenant_service.dto.PermissionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(
    name = "user-role-service",
    url = "${app.user-role-service.url:http://localhost:5115}",
    fallback = UserRoleServiceFallback.class
)
public interface UserRoleServiceClient {
    
    /**
     * Get user by ID
     */
    @GetMapping("/api/userrole/users/{userId}")
    AppUserDto getUserById(@PathVariable("userId") Integer userId,
                          @RequestHeader("Authorization") String authorization);
    
    /**
     * Get all roles
     */
    @GetMapping("/api/userrole/roles")
    List<AppRoleDto> getAllRoles(@RequestHeader("Authorization") String authorization);
    
    /**
     * Get user roles for a specific user and tenant
     */
    @GetMapping("/api/userrole/user/{userId}/tenant/{tenantId}/roles")
    List<UserRoleInfoDto> getUserRoles(@PathVariable("userId") Integer userId,
                                      @PathVariable("tenantId") Integer tenantId,
                                      @RequestHeader("Authorization") String authorization);
    
    /**
     * Get user permissions
     */
    @GetMapping("/api/userrole/user/{userId}/permissions")
    List<PermissionDto> getUserPermissions(@PathVariable("userId") Integer userId,
                                          @RequestHeader("Authorization") String authorization);
} 