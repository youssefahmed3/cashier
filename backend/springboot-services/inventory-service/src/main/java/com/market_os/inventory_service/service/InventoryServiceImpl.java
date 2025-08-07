package com.market_os.inventory_service.service;

import com.market_os.inventory_service.dto.*;
import com.market_os.inventory_service.feign.CatalogServiceClient;
import com.market_os.inventory_service.feign.TenantServiceClient;
import com.market_os.inventory_service.mapper.InventoryMapper;
import com.market_os.inventory_service.model.InventoryItem;
import com.market_os.inventory_service.repository.InventoryRepository;
import com.market_os.inventory_service.config.RabbitMQPublisher;
import lombok.extern.slf4j.Slf4j;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@Transactional
public class InventoryServiceImpl implements InventoryService {
    
    private final InventoryRepository inventoryRepository;
    private final CatalogServiceClient catalogServiceClient;
    private final TenantServiceClient tenantServiceClient;
    private final RabbitMQPublisher rabbitMQPublisher;
    
    public InventoryServiceImpl(InventoryRepository inventoryRepository, 
                              CatalogServiceClient catalogServiceClient, 
                              TenantServiceClient tenantServiceClient, 
                              RabbitMQPublisher rabbitMQPublisher) {
        this.inventoryRepository = inventoryRepository;
        this.catalogServiceClient = catalogServiceClient;
        this.tenantServiceClient = tenantServiceClient;
        this.rabbitMQPublisher = rabbitMQPublisher;
    }
    
    @Override
    public InventoryItemDto createInventoryItem(CreateInventoryItemDto createInventoryItemDto) {
        log.info("Creating new inventory item with product: {}", createInventoryItemDto.getProductId());
        
        InventoryItem inventoryItem = InventoryMapper.toEntity(createInventoryItemDto);
        InventoryItem savedItem = inventoryRepository.save(inventoryItem);
        
        log.info("Successfully created inventory item with ID: {}", savedItem.getId());
        return InventoryMapper.toDto(savedItem);
    }
    
    @Override
    public InventoryItemDto createInventoryItemWithIntegration(CreateInventoryItemDto createInventoryItemDto) {
        log.info("Creating new inventory item with integration for product: {}", createInventoryItemDto.getProductId());
        
        try {
            // Get product information from catalog service
            ProductDto product = null;
            try {
                product = getProductFromCatalog(Long.valueOf(createInventoryItemDto.getProductId()));
            } catch (Exception e) {
                log.warn("Failed to fetch product from catalog service: {}", e.getMessage());
            }
            
            // Get branch information from tenant service
            BranchDto branch = null;
            try {
                branch = getBranchFromTenantService(createInventoryItemDto.getBranchId());
            } catch (Exception e) {
                log.warn("Failed to fetch branch from tenant service: {}", e.getMessage());
            }
            
            // Create inventory item with enriched data (with fallbacks)
            String category = "Unknown Category";
            if (product != null) {
                if (product.getCategory() != null && !product.getCategory().isEmpty()) {
                    category = product.getCategory();
                } else if (product.getName() != null && product.getName().toLowerCase().contains("sneaker")) {
                    category = "Shoes";
                } else if (product.getName() != null && product.getName().toLowerCase().contains("shirt")) {
                    category = "Clothing";
                } else if (product.getName() != null && product.getName().toLowerCase().contains("phone")) {
                    category = "Electronics";
                } else {
                    category = "General";
                }
            }
            
            // Determine tenant information
            String tenantId = "main-tenant";
            String tenantName = "Main Store";
            if (branch != null) {
                tenantId = branch.getTenantId();
                // Try to get tenant name from tenant service
                try {
                    TenantDto tenant = getTenantFromTenantService(branch.getTenantId());
                    if (tenant != null && tenant.getName() != null) {
                        tenantName = tenant.getName();
                    }
                } catch (Exception e) {
                    log.warn("Failed to fetch tenant name from tenant service: {}", e.getMessage());
                    tenantName = "Store Branch";
                }
            }
            
            InventoryItem inventoryItem = InventoryItem.builder()
                    .productId(createInventoryItemDto.getProductId())
                    .productName(product != null ? product.getName() : "Unknown Product")
                    .category(category)
                    .branchId(createInventoryItemDto.getBranchId())
                    .tenantId(tenantId)
                    .quantity(createInventoryItemDto.getQuantity())
                    .isActive(true)
                    .build();
            
            InventoryItem savedItem = inventoryRepository.save(inventoryItem);
            
            log.info("Successfully created inventory item with integration - ID: {}, Product: {}, Category: {}, Branch: {}, Tenant: {} ({})", 
                    savedItem.getInventoryId(), 
                    product != null ? product.getName() : "Unknown Product",
                    category,
                    branch != null ? branch.getName() : "Unknown Branch",
                    tenantId,
                    tenantName);
            
            return InventoryMapper.toDto(savedItem);
            
        } catch (Exception e) {
            log.error("Error creating inventory item with integration: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create inventory item with integration: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryItemDto getInventoryItemById(Long id) {
        log.info("Fetching inventory item with ID: {}", id);
        
        InventoryItem inventoryItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        return InventoryMapper.toDto(inventoryItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getAllInventoryItems() {
        log.info("Fetching all inventory items");
        
        List<InventoryItem> inventoryItems = inventoryRepository.findAll();
        return inventoryItems.stream()
                .map(InventoryMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getAllActiveInventoryItems() {
        log.info("Fetching all active inventory items");
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByIsActiveTrue();
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    public InventoryItemDto updateInventoryItem(Long id, UpdateInventoryItemDto updateInventoryItemDto) {
        log.info("Updating inventory item with ID: {}", id);
        
        InventoryItem existingItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for update with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        InventoryMapper.updateEntityFromDto(updateInventoryItemDto, existingItem);
        InventoryItem updatedItem = inventoryRepository.save(existingItem);
        
        log.info("Successfully updated inventory item with ID: {}", id);
        return InventoryMapper.toDto(updatedItem);
    }
    
    @Override
    public void deleteInventoryItem(Long id) {
        log.info("Soft deleting inventory item with ID: {}", id);
        
        InventoryItem inventoryItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for deletion with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        inventoryItem.setIsActive(false);
        inventoryRepository.save(inventoryItem);
        
        log.info("Successfully soft deleted inventory item with ID: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return inventoryRepository.findByIdAndIsActiveTrue(id).isPresent();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByLocation(String location) {
        log.info("Fetching inventory items by branch ID: {}", location);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByBranchIdAndIsActiveTrue(location);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByProductSku(String productSku) {
        log.info("Fetching inventory items by product ID: {}", productSku);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByProductIdAndIsActiveTrue(productSku);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsBySupplier(String supplier) {
        log.info("Fetching inventory items by tenant ID: {}", supplier);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByTenantIdAndIsActiveTrue(supplier);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByPurchaseDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching inventory items by date range: {} to {}", startDate, endDate);
        
        // This method is no longer applicable with the new model structure
        // Return empty list for now
        return List.of();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getLowStockItems(Integer threshold) {
        log.info("Fetching low stock items with threshold: {}", threshold);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findLowStockItems(threshold);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> searchInventoryItems(String location, String productName) {
        log.info("Searching inventory items by branch ID: {} and product name: {}", location, productName);
        
        // Use the new repository method for product ID and branch ID
        List<InventoryItem> inventoryItems = inventoryRepository.findByProductIdAndBranchIdAndIsActiveTrue(productName, location);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer getTotalQuantityByProductSku(String productSku) {
        log.info("Calculating total quantity for product ID: {}", productSku);
        
        return inventoryRepository.getTotalQuantityByProductId(productSku);
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryStatsDto getInventoryStats() {
        log.info("Calculating overall inventory statistics");
        
        List<InventoryItem> activeItems = inventoryRepository.findByIsActiveTrue();
        long totalItems = activeItems.size();
        Integer totalQuantity = activeItems.stream().mapToInt(InventoryItem::getQuantity).sum();
        
        InventoryStatsDto stats = InventoryStatsDto.builder()
                .totalItems(totalItems)
                .totalQuantity(totalQuantity)
                .totalValue(0.0) // No longer tracking total value in new model
                .build();
        
        return stats;
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryStatsDto getInventoryStatsByLocation(String location) {
        log.info("Calculating inventory statistics for branch ID: {}", location);
        
        List<InventoryItem> locationItems = inventoryRepository.findByBranchIdAndIsActiveTrue(location);
        long totalItems = locationItems.size();
        Integer totalQuantity = locationItems.stream().mapToInt(InventoryItem::getQuantity).sum();
        
        InventoryStatsDto stats = InventoryStatsDto.builder()
                .totalItems(totalItems)
                .totalQuantity(totalQuantity)
                .totalValue(0.0) // No longer tracking total value in new model
                .build();
        
        return stats;
    }
    
    @Override
    public InventoryItemDto updateInventoryQuantity(Long id, Integer newQuantity) {
        log.info("Updating inventory quantity for item ID: {} to: {}", id, newQuantity);
        
        InventoryItem existingItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for quantity update with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        existingItem.setQuantity(newQuantity);
        
        InventoryItem updatedItem = inventoryRepository.save(existingItem);
        
        log.info("Successfully updated inventory quantity for item ID: {}", id);
        return InventoryMapper.toDto(updatedItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductFromCatalog(Long productId) {
        log.info("Fetching product from catalog service with ID: {}", productId);
        
        try {
            return catalogServiceClient.getProductById(productId);
        } catch (Exception e) {
            log.error("Error fetching product from catalog service: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch product from catalog service", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductFromCatalogByBarcode(String barcode) {
        log.info("Fetching product from catalog service by barcode: {}", barcode);
        
        try {
            return catalogServiceClient.getProductByBarcode(barcode);
        } catch (Exception e) {
            log.error("Error fetching product by barcode from catalog service: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch product by barcode from catalog service", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public TenantDto getTenantFromTenantService(String tenantId) {
        log.info("Fetching tenant from tenant service with ID: {}", tenantId);
        
        try {
            return tenantServiceClient.getTenantById(tenantId);
        } catch (Exception e) {
            log.error("Error fetching tenant from tenant service: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch tenant from tenant service", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public BranchDto getBranchFromTenantService(String branchId) {
        log.info("Fetching branch from tenant service with ID: {}", branchId);
        
        try {
            return tenantServiceClient.getBranchById(branchId);
        } catch (Exception e) {
            log.error("Error fetching branch from tenant service: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch branch from tenant service", e);
        }
    }
    
    @Override
    public InventoryItemDto createInventoryItemWithProductValidation(CreateInventoryItemDto createInventoryItemDto) {
        log.info("Creating inventory item with product validation for product: {}", createInventoryItemDto.getProductId());
        
        // Validate product exists in catalog service
        try {
            catalogServiceClient.getProductById(Long.valueOf(createInventoryItemDto.getProductId()));
            log.info("Product validation successful for ID: {}", createInventoryItemDto.getProductId());
        } catch (Exception e) {
            log.error("Product validation failed for ID: {}", createInventoryItemDto.getProductId());
            throw new RuntimeException("Product not found in catalog service", e);
        }
        
        InventoryItem inventoryItem = InventoryMapper.toEntity(createInventoryItemDto);
        InventoryItem savedItem = inventoryRepository.save(inventoryItem);
        
        log.info("Successfully created inventory item with product validation, ID: {}", savedItem.getId());
        return InventoryMapper.toDto(savedItem);
    }
    
    @Override
    public InventoryItemDto updateInventoryWithNotification(Long id, UpdateInventoryItemDto updateInventoryItemDto) {
        log.info("Updating inventory item with notification for ID: {}", id);
        
        InventoryItem existingItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for update with notification, ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        InventoryMapper.updateEntityFromDto(updateInventoryItemDto, existingItem);
        InventoryItem updatedItem = inventoryRepository.save(existingItem);
        
        // Send notification via RabbitMQ
        InventoryItemDto itemDto = InventoryMapper.toDto(updatedItem);
        try {
            rabbitMQPublisher.publishStockUpdate(itemDto);
            log.info("Inventory update notification sent for item ID: {}", id);
        } catch (Exception e) {
            log.error("Failed to send inventory update notification for item ID: {}", id, e);
            // Don't fail the update if notification fails
        }
        
        log.info("Successfully updated inventory item with notification, ID: {}", id);
        
        // Additional business logic for low stock alerts
        if (updatedItem.getQuantity() != null && updatedItem.getQuantity() < 10) {
            try {
                rabbitMQPublisher.publishLowStockAlert(itemDto, 10);
                log.info("Low stock alert sent for item ID: {}", id);
            } catch (Exception e) {
                log.error("Failed to send low stock alert for item ID: {}", id, e);
            }
        }
        
        return itemDto;
    }
    
    @Override
    public void decreaseStockForOrder(StockUpdateEvent stockUpdateEvent) {
        log.info("Processing stock decrease for order: {}", stockUpdateEvent.getOrderId());
        
        if (stockUpdateEvent.getItems() == null || stockUpdateEvent.getItems().isEmpty()) {
            log.warn("No items found in stock decrease event for order: {}", stockUpdateEvent.getOrderId());
            return;
        }
        
        for (StockUpdateItem item : stockUpdateEvent.getItems()) {
            try {
                // Convert productId to string for SKU lookup
                String productSku = String.valueOf(item.getProductId());
                int quantityToDecrease = item.getQuantity().intValue();
                
                log.info("Decreasing stock for product SKU: {} by quantity: {}", productSku, quantityToDecrease);
                updateStockQuantityByProductSku(productSku, -quantityToDecrease);
                
            } catch (Exception e) {
                log.error("Error decreasing stock for product ID: {}", item.getProductId(), e);
                throw new RuntimeException("Failed to decrease stock for product: " + item.getProductId(), e);
            }
        }
        
        log.info("Successfully processed stock decrease for order: {}", stockUpdateEvent.getOrderId());
    }
    
    @Override
    public void restockItemsForRefund(StockUpdateEvent stockUpdateEvent) {
        log.info("Processing stock restock for refund: {}", stockUpdateEvent.getRefundId());
        
        if (stockUpdateEvent.getItems() == null || stockUpdateEvent.getItems().isEmpty()) {
            log.warn("No items found in stock restock event for refund: {}", stockUpdateEvent.getRefundId());
            return;
        }
        
        for (StockUpdateItem item : stockUpdateEvent.getItems()) {
            try {
                // Convert productId to string for SKU lookup
                String productSku = String.valueOf(item.getProductId());
                int quantityToRestock = item.getQuantity().intValue();
                
                log.info("Restocking product SKU: {} by quantity: {}", productSku, quantityToRestock);
                updateStockQuantityByProductSku(productSku, quantityToRestock);
                
            } catch (Exception e) {
                log.error("Error restocking product ID: {}", item.getProductId(), e);
                throw new RuntimeException("Failed to restock product: " + item.getProductId(), e);
            }
        }
        
        log.info("Successfully processed stock restock for refund: {}", stockUpdateEvent.getRefundId());
    }
    
    @Override
    public void updateStockQuantityByProductSku(String productSku, Integer quantityChange) {
        log.info("Updating stock quantity for product SKU: {} by change: {}", productSku, quantityChange);
        
        // Find all inventory items for this product SKU
        List<InventoryItem> inventoryItems = inventoryRepository.findByProductIdOrderByCreatedAtAsc(productSku);
        
        if (inventoryItems.isEmpty()) {
            log.warn("No inventory items found for product SKU: {}", productSku);
            throw new RuntimeException("No inventory items found for product SKU: " + productSku);
        }
        
        int remainingQuantity = Math.abs(quantityChange);
        boolean isDecrease = quantityChange < 0;
        
        for (InventoryItem item : inventoryItems) {
            if (remainingQuantity <= 0) break;
            
            int currentQuantity = item.getQuantity();
            int quantityToUpdate;
            
            if (isDecrease) {
                // For decrease, we can't go below 0
                quantityToUpdate = Math.min(currentQuantity, remainingQuantity);
                if (quantityToUpdate > currentQuantity) {
                    log.error("Insufficient stock for product SKU: {}. Available: {}, Requested: {}", 
                             productSku, currentQuantity, remainingQuantity);
                    throw new RuntimeException("Insufficient stock for product SKU: " + productSku);
                }
            } else {
                // For increase, we can add to any item
                quantityToUpdate = remainingQuantity;
            }
            
            // Update the quantity
            inventoryRepository.updateQuantityById(item.getId(), isDecrease ? -quantityToUpdate : quantityToUpdate);
            remainingQuantity -= quantityToUpdate;
            
            log.info("Updated inventory item ID: {} for product SKU: {} by quantity: {}", 
                    item.getId(), productSku, isDecrease ? -quantityToUpdate : quantityToUpdate);
        }
        
        if (remainingQuantity > 0 && isDecrease) {
            log.error("Insufficient stock for product SKU: {}. Remaining quantity needed: {}", 
                     productSku, remainingQuantity);
            throw new RuntimeException("Insufficient stock for product SKU: " + productSku);
        }
        
        log.info("Successfully updated stock quantity for product SKU: {}", productSku);
    }
} 