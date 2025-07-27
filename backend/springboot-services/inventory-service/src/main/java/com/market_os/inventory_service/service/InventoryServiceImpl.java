package com.market_os.inventory_service.service;

import com.market_os.inventory_service.dto.*;
import com.market_os.inventory_service.feign.CatalogServiceClient;
import com.market_os.inventory_service.feign.TenantServiceClient;
import com.market_os.inventory_service.mapper.InventoryMapper;
import com.market_os.inventory_service.model.InventoryItem;
import com.market_os.inventory_service.repository.InventoryRepository;
import com.market_os.inventory_service.config.RabbitMQPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InventoryServiceImpl implements InventoryService {
    
    private final InventoryRepository inventoryRepository;
    private final CatalogServiceClient catalogServiceClient;
    private final TenantServiceClient tenantServiceClient;
    private final RabbitMQPublisher rabbitMQPublisher;
    
    @Override
    public InventoryItemDto createInventoryItem(CreateInventoryItemDto createInventoryItemDto) {
        log.info("Creating new inventory item with product: {}", createInventoryItemDto.getProductName());
        
        InventoryItem inventoryItem = InventoryMapper.toEntity(createInventoryItemDto);
        InventoryItem savedItem = inventoryRepository.save(inventoryItem);
        
        log.info("Successfully created inventory item with ID: {}", savedItem.getId());
        return InventoryMapper.toDto(savedItem);
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
    public Page<InventoryItemDto> getAllInventoryItems(Pageable pageable) {
        log.info("Fetching all inventory items with pagination");
        
        Page<InventoryItem> inventoryItems = inventoryRepository.findAll(pageable);
        return inventoryItems.map(InventoryMapper::toDto);
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
        log.info("Fetching inventory items by location: {}", location);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByLocationAndIsActiveTrue(location);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByProductSku(String productSku) {
        log.info("Fetching inventory items by product SKU: {}", productSku);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByProductSkuAndIsActiveTrue(productSku);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsBySupplier(String supplier) {
        log.info("Fetching inventory items by supplier: {}", supplier);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findBySupplierAndIsActiveTrue(supplier);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByPurchaseDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching inventory items by purchase date range: {} to {}", startDate, endDate);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByPurchDateBetweenAndIsActiveTrue(startDate, endDate);
        return InventoryMapper.toDtoList(inventoryItems);
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
        log.info("Searching inventory items by location: {} and product name: {}", location, productName);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByLocationAndProductNameContainingIgnoreCaseAndIsActiveTrue(location, productName);
        return InventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer getTotalQuantityByProductSku(String productSku) {
        log.info("Calculating total quantity for product SKU: {}", productSku);
        
        return inventoryRepository.getTotalQuantityByProductSku(productSku);
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryStatsDto getInventoryStats() {
        log.info("Calculating overall inventory statistics");
        
        List<InventoryItem> activeItems = inventoryRepository.findByIsActiveTrue();
        long totalItems = activeItems.size();
        Integer totalQuantity = activeItems.stream().mapToInt(InventoryItem::getQty).sum();
        Double totalValue = inventoryRepository.getTotalInventoryValue();
        
        InventoryStatsDto stats = InventoryStatsDto.builder()
                .totalItems(totalItems)
                .totalQuantity(totalQuantity)
                .totalValue(totalValue != null ? totalValue : 0.0)
                .build();
        
        return stats;
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryStatsDto getInventoryStatsByLocation(String location) {
        log.info("Calculating inventory statistics for location: {}", location);
        
        List<InventoryItem> locationItems = inventoryRepository.findByLocationAndIsActiveTrue(location);
        long totalItems = locationItems.size();
        Integer totalQuantity = locationItems.stream().mapToInt(InventoryItem::getQty).sum();
        Double totalValue = inventoryRepository.getTotalInventoryValueByLocation(location);
        
        InventoryStatsDto stats = InventoryStatsDto.builder()
                .totalItems(totalItems)
                .totalQuantity(totalQuantity)
                .totalValue(totalValue != null ? totalValue : 0.0)
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
        
        existingItem.setQty(newQuantity);
        
        // Recalculate total cost
        if (existingItem.getUnitPrice() != null) {
            existingItem.setTotalCost(existingItem.getUnitPrice() * newQuantity);
        }
        
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
    public TenantDto getTenantFromTenantService(Long tenantId) {
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
    public BranchDto getBranchFromTenantService(Long branchId) {
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
        log.info("Creating inventory item with product validation for product: {}", createInventoryItemDto.getProductName());
        
        // Validate product exists in catalog service
        try {
            catalogServiceClient.getProductByBarcode(createInventoryItemDto.getProductSku());
            log.info("Product validation successful for SKU: {}", createInventoryItemDto.getProductSku());
        } catch (Exception e) {
            log.error("Product validation failed for SKU: {}", createInventoryItemDto.getProductSku());
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
        if (updatedItem.getQty() != null && updatedItem.getQty() < 10) {
            try {
                rabbitMQPublisher.publishLowStockAlert(itemDto, 10);
                log.info("Low stock alert sent for item ID: {}", id);
            } catch (Exception e) {
                log.error("Failed to send low stock alert for item ID: {}", id, e);
            }
        }
        
        return itemDto;
    }
} 