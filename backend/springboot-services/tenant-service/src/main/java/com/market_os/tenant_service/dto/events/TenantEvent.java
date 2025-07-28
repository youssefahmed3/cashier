package com.market_os.tenant_service.dto.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantEvent {
    
    @JsonProperty("event_id")
    private UUID eventId;
    
    @JsonProperty("tenant_id")
    private UUID tenantId;
    
    @JsonProperty("tenant_name")
    private String tenantName;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    @JsonProperty("logo_url")
    private String logoUrl;
    
    @JsonProperty("event_type")
    private String eventType; // CREATED, UPDATED, DELETED
    
    @JsonProperty("timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    @JsonProperty("service_name")
    private String serviceName;
    
    public static TenantEvent created(UUID tenantId, String tenantName, Boolean isActive, String logoUrl) {
        return TenantEvent.builder()
                .eventId(UUID.randomUUID())
                .tenantId(tenantId)
                .tenantName(tenantName)
                .isActive(isActive)
                .logoUrl(logoUrl)
                .eventType("CREATED")
                .timestamp(LocalDateTime.now())
                .serviceName("tenant-service")
                .build();
    }
    
    public static TenantEvent updated(UUID tenantId, String tenantName, Boolean isActive, String logoUrl) {
        return TenantEvent.builder()
                .eventId(UUID.randomUUID())
                .tenantId(tenantId)
                .tenantName(tenantName)
                .isActive(isActive)
                .logoUrl(logoUrl)
                .eventType("UPDATED")
                .timestamp(LocalDateTime.now())
                .serviceName("tenant-service")
                .build();
    }
    
    public static TenantEvent deleted(UUID tenantId, String tenantName) {
        return TenantEvent.builder()
                .eventId(UUID.randomUUID())
                .tenantId(tenantId)
                .tenantName(tenantName)
                .eventType("DELETED")
                .timestamp(LocalDateTime.now())
                .serviceName("tenant-service")
                .build();
    }
} 