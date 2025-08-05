package com.market_os.inventory_service.mapper;

import com.market_os.inventory_service.dto.CreateInventoryItemDto;
import com.market_os.inventory_service.dto.InventoryItemDto;
import com.market_os.inventory_service.dto.UpdateInventoryItemDto;
import com.market_os.inventory_service.model.InventoryItem;

import java.time.LocalDate;
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
        
        InventoryItemDto dto = new InventoryItemDto();
        dto.setId(inventoryItem.getId());
        dto.setPurchDate(inventoryItem.getPurchDate());
        dto.setLocation(inventoryItem.getLocation());
        dto.setQty(inventoryItem.getQty());
        dto.setProductName(inventoryItem.getProductName());
        dto.setProductSku(inventoryItem.getProductSku());
        dto.setUnitPrice(inventoryItem.getUnitPrice());
        dto.setTotalCost(inventoryItem.getTotalCost());
        dto.setSupplier(inventoryItem.getSupplier());
        dto.setIsActive(inventoryItem.getIsActive());
        dto.setCreatedAt(inventoryItem.getCreatedAt());
        dto.setUpdatedAt(inventoryItem.getUpdatedAt());
        return dto;
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
        
        InventoryItem item = new InventoryItem();
        item.setPurchDate(LocalDate.now());
        item.setLocation(createDto.getLocation());
        item.setQty(createDto.getQty());
        item.setProductName(createDto.getProductName());
        item.setProductSku(createDto.getProductSku());
        item.setUnitPrice(createDto.getUnitPrice());
        item.setSupplier(createDto.getSupplier());
        item.setIsActive(true);
        
        // Calculate total cost
        if (createDto.getUnitPrice() != null && createDto.getQty() != null) {
            item.setTotalCost(createDto.getUnitPrice() * createDto.getQty());
        }
        
        return item;
    }
    
    /**
     * Update InventoryItem entity from UpdateInventoryItemDto
     * Only updates non-null fields
     */
    public static void updateEntityFromDto(UpdateInventoryItemDto updateDto, InventoryItem target) {
        if (updateDto == null || target == null) {
            return;
        }
        
        if (updateDto.getPurchDate() != null) {
            target.setPurchDate(updateDto.getPurchDate());
        }
        if (updateDto.getLocation() != null) {
            target.setLocation(updateDto.getLocation());
        }
        if (updateDto.getQty() != null) {
            target.setQty(updateDto.getQty());
        }
        if (updateDto.getProductName() != null) {
            target.setProductName(updateDto.getProductName());
        }
        if (updateDto.getProductSku() != null) {
            target.setProductSku(updateDto.getProductSku());
        }
        if (updateDto.getUnitPrice() != null) {
            target.setUnitPrice(updateDto.getUnitPrice());
        }
        if (updateDto.getSupplier() != null) {
            target.setSupplier(updateDto.getSupplier());
        }
        
        // Recalculate total cost if unit price or quantity changed
        Double price = updateDto.getUnitPrice() != null ? updateDto.getUnitPrice() : target.getUnitPrice();
        Integer quantity = updateDto.getQty() != null ? updateDto.getQty() : target.getQty();
        
        if (price != null && quantity != null) {
            target.setTotalCost(price * quantity);
        }
    }
} 