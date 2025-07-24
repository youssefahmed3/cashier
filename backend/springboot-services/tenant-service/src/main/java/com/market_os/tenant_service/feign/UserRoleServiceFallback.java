package com.market_os.tenant_service.feign;

import com.market_os.tenant_service.dto.AppUserDto;
import com.market_os.tenant_service.dto.AppRoleDto;
import com.market_os.tenant_service.dto.UserRoleInfoDto;
import com.market_os.tenant_service.dto.PermissionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class UserRoleServiceFallback implements UserRoleServiceClient {
    
    @Override
    public AppUserDto getUserById(Integer userId, String authorization) {
        log.warn("User role service is unavailable for user ID: {}. Returning empty user.", userId);
        return AppUserDto.builder()
                .id(userId)
                .firstname("Unknown")
                .lastname("User")
                .email("unknown@email.com")
                .isSuspended(false)
                .build();
    }
    
    @Override
    public List<AppRoleDto> getAllRoles(String authorization) {
        log.warn("User role service is unavailable. Returning empty roles list.");
        return List.of();
    }
    
    @Override
    public List<UserRoleInfoDto> getUserRoles(Integer userId, Integer tenantId, String authorization) {
        log.warn("User role service is unavailable for user {} and tenant {}. Returning empty roles.", userId, tenantId);
        return List.of();
    }
    
    @Override
    public List<PermissionDto> getUserPermissions(Integer userId, String authorization) {
        log.warn("User role service is unavailable for user {}. Returning empty permissions.", userId);
        return List.of();
    }
} 