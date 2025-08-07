package com.market_os.inventory_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdateEvent {
    
    private String eventType; // "StockDecrease" or "StockRestock"
    private Long branchId;
    private List<StockUpdateItem> items;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    private String reference;
    private Long orderId;
    private Long refundId;
} 