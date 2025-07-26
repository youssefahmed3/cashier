package com.market_os.inventory_service.mapper;

import com.market_os.inventory_service.dto.CreateInventoryItemDto;
import com.market_os.inventory_service.dto.InventoryItemDto;
import com.market_os.inventory_service.dto.UpdateInventoryItemDto;
import com.market_os.inventory_service.model.InventoryItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InventoryMapper {
    
    /**
     * Convert InventoryItem entity to DTO
     */
    InventoryItemDto toDto(InventoryItem inventoryItem);
    
    /**
     * Convert list of InventoryItem entities to DTOs
     */
    List<InventoryItemDto> toDtoList(List<InventoryItem> inventoryItems);
    
    /**
     * Convert CreateInventoryItemDto to InventoryItem entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "totalCost", expression = "java(calculateTotalCost(createDto.getUnitPrice(), createDto.getQty()))")
    InventoryItem toEntity(CreateInventoryItemDto createDto);
    
    /**
     * Update InventoryItem entity from UpdateInventoryItemDto
     * Only updates non-null fields
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "totalCost", expression = "java(calculateTotalCostForUpdate(updateDto.getUnitPrice(), updateDto.getQty(), target))")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateInventoryItemDto updateDto, @MappingTarget InventoryItem target);
    
    /**
     * Calculate total cost for create operation
     */
    default Double calculateTotalCost(Double unitPrice, Integer qty) {
        if (unitPrice != null && qty != null) {
            return unitPrice * qty;
        }
        return null;
    }
    
    /**
     * Calculate total cost for update operation
     */
    default Double calculateTotalCostForUpdate(Double unitPrice, Integer qty, InventoryItem target) {
        Double price = unitPrice != null ? unitPrice : target.getUnitPrice();
        Integer quantity = qty != null ? qty : target.getQty();
        
        if (price != null && quantity != null) {
            return price * quantity;
        }
        return target.getTotalCost();
    }
} 