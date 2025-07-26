package com.market_os.inventory_service.controller;

import com.market_os.inventory_service.dto.*;
import com.market_os.inventory_service.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Inventory Management", description = "REST API for inventory management operations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    @PostMapping
    @Operation(summary = "Create a new inventory item", description = "Creates a new inventory item in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Inventory item created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<InventoryItemDto> createInventoryItem(
            @Valid @RequestBody CreateInventoryItemDto createInventoryItemDto) {
        log.info("REST request to create inventory item: {}", createInventoryItemDto);
        
        InventoryItemDto createdItem = inventoryService.createInventoryItem(createInventoryItemDto);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get inventory item by ID", description = "Retrieves an inventory item by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory item found"),
            @ApiResponse(responseCode = "404", description = "Inventory item not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<InventoryItemDto> getInventoryItemById(
            @Parameter(description = "Inventory item ID") @PathVariable Long id) {
        log.info("REST request to get inventory item by ID: {}", id);
        
        InventoryItemDto inventoryItem = inventoryService.getInventoryItemById(id);
        return ResponseEntity.ok(inventoryItem);
    }
    
    @GetMapping
    @Operation(summary = "Get all inventory items", description = "Retrieves all inventory items with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Page<InventoryItemDto>> getAllInventoryItems(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("REST request to get all inventory items with pagination");
        
        Page<InventoryItemDto> inventoryItems = inventoryService.getAllInventoryItems(pageable);
        return ResponseEntity.ok(inventoryItems);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get all active inventory items", description = "Retrieves all active inventory items")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Active inventory items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> getAllActiveInventoryItems() {
        log.info("REST request to get all active inventory items");
        
        List<InventoryItemDto> activeItems = inventoryService.getAllActiveInventoryItems();
        return ResponseEntity.ok(activeItems);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update inventory item", description = "Updates an existing inventory item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory item updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Inventory item not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<InventoryItemDto> updateInventoryItem(
            @Parameter(description = "Inventory item ID") @PathVariable Long id,
            @Valid @RequestBody UpdateInventoryItemDto updateInventoryItemDto) {
        log.info("REST request to update inventory item with ID: {}", id);
        
        InventoryItemDto updatedItem = inventoryService.updateInventoryItem(id, updateInventoryItemDto);
        return ResponseEntity.ok(updatedItem);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete inventory item", description = "Soft deletes an inventory item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Inventory item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Inventory item not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteInventoryItem(
            @Parameter(description = "Inventory item ID") @PathVariable Long id) {
        log.info("REST request to delete inventory item with ID: {}", id);
        
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/location/{location}")
    @Operation(summary = "Get inventory items by location", description = "Retrieves inventory items by location")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsByLocation(
            @Parameter(description = "Location name") @PathVariable String location) {
        log.info("REST request to get inventory items by location: {}", location);
        
        List<InventoryItemDto> items = inventoryService.getInventoryItemsByLocation(location);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/sku/{productSku}")
    @Operation(summary = "Get inventory items by product SKU", description = "Retrieves inventory items by product SKU")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsByProductSku(
            @Parameter(description = "Product SKU") @PathVariable String productSku) {
        log.info("REST request to get inventory items by product SKU: {}", productSku);
        
        List<InventoryItemDto> items = inventoryService.getInventoryItemsByProductSku(productSku);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/supplier/{supplier}")
    @Operation(summary = "Get inventory items by supplier", description = "Retrieves inventory items by supplier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsBySupplier(
            @Parameter(description = "Supplier name") @PathVariable String supplier) {
        log.info("REST request to get inventory items by supplier: {}", supplier);
        
        List<InventoryItemDto> items = inventoryService.getInventoryItemsBySupplier(supplier);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Get inventory items by purchase date range", description = "Retrieves inventory items within a purchase date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory items retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid date format"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> getInventoryItemsByPurchaseDateRange(
            @Parameter(description = "Start date (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (yyyy-MM-dd)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("REST request to get inventory items by purchase date range: {} to {}", startDate, endDate);
        
        List<InventoryItemDto> items = inventoryService.getInventoryItemsByPurchaseDateRange(startDate, endDate);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock items", description = "Retrieves inventory items with quantity below threshold")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Low stock items retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> getLowStockItems(
            @Parameter(description = "Stock threshold") @RequestParam(defaultValue = "10") Integer threshold) {
        log.info("REST request to get low stock items with threshold: {}", threshold);
        
        List<InventoryItemDto> items = inventoryService.getLowStockItems(threshold);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search inventory items", description = "Searches inventory items by location and product name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<InventoryItemDto>> searchInventoryItems(
            @Parameter(description = "Location name") @RequestParam String location,
            @Parameter(description = "Product name (partial match)") @RequestParam String productName) {
        log.info("REST request to search inventory items by location: {} and product name: {}", location, productName);
        
        List<InventoryItemDto> items = inventoryService.searchInventoryItems(location, productName);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/quantity/{productSku}")
    @Operation(summary = "Get total quantity by product SKU", description = "Retrieves total quantity for a specific product SKU")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Total quantity retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Integer> getTotalQuantityByProductSku(
            @Parameter(description = "Product SKU") @PathVariable String productSku) {
        log.info("REST request to get total quantity for product SKU: {}", productSku);
        
        Integer totalQuantity = inventoryService.getTotalQuantityByProductSku(productSku);
        return ResponseEntity.ok(totalQuantity);
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get inventory statistics", description = "Retrieves overall inventory statistics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory statistics retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<InventoryStatsDto> getInventoryStats() {
        log.info("REST request to get inventory statistics");
        
        InventoryStatsDto stats = inventoryService.getInventoryStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/location/{location}")
    @Operation(summary = "Get inventory statistics by location", description = "Retrieves inventory statistics for a specific location")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Location inventory statistics retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<InventoryStatsDto> getInventoryStatsByLocation(
            @Parameter(description = "Location name") @PathVariable String location) {
        log.info("REST request to get inventory statistics for location: {}", location);
        
        InventoryStatsDto stats = inventoryService.getInventoryStatsByLocation(location);
        return ResponseEntity.ok(stats);
    }
    
    @PatchMapping("/{id}/quantity")
    @Operation(summary = "Update inventory quantity", description = "Updates only the quantity of an inventory item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inventory quantity updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid quantity value"),
            @ApiResponse(responseCode = "404", description = "Inventory item not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<InventoryItemDto> updateInventoryQuantity(
            @Parameter(description = "Inventory item ID") @PathVariable Long id,
            @Parameter(description = "New quantity") @RequestParam Integer newQuantity) {
        log.info("REST request to update inventory quantity for item ID: {} to quantity: {}", id, newQuantity);
        
        InventoryItemDto updatedItem = inventoryService.updateInventoryQuantity(id, newQuantity);
        return ResponseEntity.ok(updatedItem);
    }
} 