package com.market_os.inventory_service.service;

import com.market_os.inventory_service.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface InventoryService {
    
    /**
     * Create a new inventory item
     */
    InventoryItemDto createInventoryItem(CreateInventoryItemDto createInventoryItemDto);
    
    /**
     * Get inventory item by ID
     */
    InventoryItemDto getInventoryItemById(Long id);
    
    /**
     * Get all inventory items with pagination
     */
    Page<InventoryItemDto> getAllInventoryItems(Pageable pageable);
    
    /**
     * Get all active inventory items
     */
    List<InventoryItemDto> getAllActiveInventoryItems();
    
    /**
     * Update inventory item
     */
    InventoryItemDto updateInventoryItem(Long id, UpdateInventoryItemDto updateInventoryItemDto);
    
    /**
     * Delete inventory item (soft delete - set isActive to false)
     */
    void deleteInventoryItem(Long id);
    
    /**
     * Check if inventory item exists
     */
    boolean existsById(Long id);
    
    /**
     * Get inventory items by location
     */
    List<InventoryItemDto> getInventoryItemsByLocation(String location);
    
    /**
     * Get inventory items by product SKU
     */
    List<InventoryItemDto> getInventoryItemsByProductSku(String productSku);
    
    /**
     * Get inventory items by supplier
     */
    List<InventoryItemDto> getInventoryItemsBySupplier(String supplier);
    
    /**
     * Get inventory items by purchase date range
     */
    List<InventoryItemDto> getInventoryItemsByPurchaseDateRange(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get low stock items (quantity below threshold)
     */
    List<InventoryItemDto> getLowStockItems(Integer threshold);
    
    /**
     * Search inventory items by location and product name
     */
    List<InventoryItemDto> searchInventoryItems(String location, String productName);
    
    /**
     * Get total quantity by product SKU
     */
    Integer getTotalQuantityByProductSku(String productSku);
    
    /**
     * Get inventory statistics
     */
    InventoryStatsDto getInventoryStats();
    
    /**
     * Get inventory statistics by location
     */
    InventoryStatsDto getInventoryStatsByLocation(String location);
    
    /**
     * Update inventory quantity (for stock adjustments)
     */
    InventoryItemDto updateInventoryQuantity(Long id, Integer newQuantity);
} 