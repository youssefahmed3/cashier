package com.market_os.tenant_service.dto.events;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchEvent {
    
    @JsonProperty("event_id")
    private UUID eventId;
    
    @JsonProperty("branch_id")
    private UUID branchId;
    
    @JsonProperty("tenant_id")
    private UUID tenantId;
    
    @JsonProperty("branch_name")
    private String branchName;
    
    private String phone;
    
    private String location;
    
    @JsonProperty("tax_percentage")
    private BigDecimal taxPercentage;
    
    @JsonProperty("event_type")
    private String eventType; // CREATED, UPDATED, DELETED
    
    @JsonProperty("timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    @JsonProperty("service_name")
    private String serviceName;
    
    public static BranchEvent created(UUID branchId, UUID tenantId, String branchName, String phone, 
                                     String location, BigDecimal taxPercentage) {
        return BranchEvent.builder()
                .eventId(UUID.randomUUID())
                .branchId(branchId)
                .tenantId(tenantId)
                .branchName(branchName)
                .phone(phone)
                .location(location)
                .taxPercentage(taxPercentage)
                .eventType("CREATED")
                .timestamp(LocalDateTime.now())
                .serviceName("tenant-service")
                .build();
    }
    
    public static BranchEvent updated(UUID branchId, UUID tenantId, String branchName, String phone, 
                                     String location, BigDecimal taxPercentage) {
        return BranchEvent.builder()
                .eventId(UUID.randomUUID())
                .branchId(branchId)
                .tenantId(tenantId)
                .branchName(branchName)
                .phone(phone)
                .location(location)
                .taxPercentage(taxPercentage)
                .eventType("UPDATED")
                .timestamp(LocalDateTime.now())
                .serviceName("tenant-service")
                .build();
    }
    
    public static BranchEvent deleted(UUID branchId, UUID tenantId, String branchName) {
        return BranchEvent.builder()
                .eventId(UUID.randomUUID())
                .branchId(branchId)
                .tenantId(tenantId)
                .branchName(branchName)
                .eventType("DELETED")
                .timestamp(LocalDateTime.now())
                .serviceName("tenant-service")
                .build();
    }
} 