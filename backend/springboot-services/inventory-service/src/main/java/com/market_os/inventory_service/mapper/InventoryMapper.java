package com.market_os.inventory_service.mapper;

import com.market_os.inventory_service.dto.CreateInventoryItemDto;
import com.market_os.inventory_service.dto.InventoryItemDto;
import com.market_os.inventory_service.dto.UpdateInventoryItemDto;
import com.market_os.inventory_service.model.InventoryItem;

import java.util.List;
import java.util.stream.Collectors;

public class InventoryMapper {
    
    /**
     * Convert InventoryItem entity to DTO
     */
    public static InventoryItemDto toDto(InventoryItem inventoryItem) {
        if (inventoryItem == null) {
            return null;
        }
        
        return InventoryItemDto.builder()
                .inventoryId(inventoryItem.getInventoryId())
                .productId(inventoryItem.getProductId())
                .productName(inventoryItem.getProductName())
                .category(inventoryItem.getCategory())
                .branchId(inventoryItem.getBranchId())
                .tenantId(inventoryItem.getTenantId())
                .quantity(inventoryItem.getQuantity())
                .isActive(inventoryItem.getIsActive())
                .createdAt(inventoryItem.getCreatedAt())
                .lastUpdated(inventoryItem.getLastUpdated())
                .build();
    }
    
    /**
     * Convert list of InventoryItem entities to DTOs
     */
    public static List<InventoryItemDto> toDtoList(List<InventoryItem> inventoryItems) {
        if (inventoryItems == null) {
            return null;
        }
        
        return inventoryItems.stream()
                .map(InventoryMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert CreateInventoryItemDto to InventoryItem entity
     */
    public static InventoryItem toEntity(CreateInventoryItemDto createDto) {
        if (createDto == null) {
            return null;
        }
        
        return InventoryItem.builder()
                .productId(createDto.getProductId())
                .branchId(createDto.getBranchId())
                .quantity(createDto.getQuantity())
                .isActive(true)
                .build();
    }
    
    /**
     * Update InventoryItem entity from UpdateInventoryItemDto
     * Only updates non-null fields
     */
    public static void updateEntityFromDto(UpdateInventoryItemDto updateDto, InventoryItem target) {
        if (updateDto == null || target == null) {
            return;
        }
        
        if (updateDto.getProductId() != null) {
            target.setProductId(updateDto.getProductId());
        }
        if (updateDto.getBranchId() != null) {
            target.setBranchId(updateDto.getBranchId());
        }
        if (updateDto.getQuantity() != null) {
            target.setQuantity(updateDto.getQuantity());
        }
        if (updateDto.getProductName() != null) {
            target.setProductName(updateDto.getProductName());
        }
        if (updateDto.getCategory() != null) {
            target.setCategory(updateDto.getCategory());
        }
    }
} 