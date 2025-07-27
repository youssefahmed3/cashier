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
    private final InventoryMapper inventoryMapper;
    private final CatalogServiceClient catalogServiceClient;
    private final TenantServiceClient tenantServiceClient;
    private final RabbitMQPublisher rabbitMQPublisher;
    
    @Override
    public InventoryItemDto createInventoryItem(CreateInventoryItemDto createInventoryItemDto) {
        log.info("Creating new inventory item with product: {}", createInventoryItemDto.getProductName());
        
        InventoryItem inventoryItem = inventoryMapper.toEntity(createInventoryItemDto);
        InventoryItem savedItem = inventoryRepository.save(inventoryItem);
        
        log.info("Successfully created inventory item with ID: {}", savedItem.getId());
        return inventoryMapper.toDto(savedItem);
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
        
        return inventoryMapper.toDto(inventoryItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<InventoryItemDto> getAllInventoryItems(Pageable pageable) {
        log.info("Fetching all inventory items with pagination");
        
        Page<InventoryItem> inventoryItems = inventoryRepository.findAll(pageable);
        return inventoryItems.map(inventoryMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getAllActiveInventoryItems() {
        log.info("Fetching all active inventory items");
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByIsActiveTrue();
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    public InventoryItemDto updateInventoryItem(Long id, UpdateInventoryItemDto updateInventoryItemDto) {
        log.info("Updating inventory item with ID: {}", id);
        
        InventoryItem existingItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for update with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        inventoryMapper.updateEntityFromDto(updateInventoryItemDto, existingItem);
        InventoryItem updatedItem = inventoryRepository.save(existingItem);
        
        log.info("Successfully updated inventory item with ID: {}", id);
        return inventoryMapper.toDto(updatedItem);
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
        return inventoryRepository.existsById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByLocation(String location) {
        log.info("Fetching inventory items by location: {}", location);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByLocationAndIsActiveTrue(location);
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByProductSku(String productSku) {
        log.info("Fetching inventory items by product SKU: {}", productSku);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByProductSkuAndIsActiveTrue(productSku);
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsBySupplier(String supplier) {
        log.info("Fetching inventory items by supplier: {}", supplier);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findBySupplierAndIsActiveTrue(supplier);
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItemsByPurchaseDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching inventory items by purchase date range: {} to {}", startDate, endDate);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findByPurchDateBetweenAndIsActiveTrue(startDate, endDate);
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getLowStockItems(Integer threshold) {
        log.info("Fetching low stock items with threshold: {}", threshold);
        
        List<InventoryItem> inventoryItems = inventoryRepository.findLowStockItems(threshold);
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> searchInventoryItems(String location, String productName) {
        log.info("Searching inventory items by location: {} and product name: {}", location, productName);
        
        List<InventoryItem> inventoryItems = inventoryRepository
                .findByLocationAndProductNameContainingIgnoreCaseAndIsActiveTrue(location, productName);
        return inventoryMapper.toDtoList(inventoryItems);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer getTotalQuantityByProductSku(String productSku) {
        log.info("Getting total quantity for product SKU: {}", productSku);
        return inventoryRepository.getTotalQuantityByProductSku(productSku);
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryStatsDto getInventoryStats() {
        log.info("Calculating inventory statistics");
        
        long totalItems = inventoryRepository.count();
        Double totalValue = inventoryRepository.getTotalInventoryValue();
        List<InventoryItem> activeItems = inventoryRepository.findByIsActiveTrue();
        
        Integer totalQuantity = activeItems.stream()
                .mapToInt(InventoryItem::getQty)
                .sum();
        
        Long lowStockCount = (long) inventoryRepository.findLowStockItems(10).size(); // Default threshold of 10
        
        Integer distinctLocations = (int) activeItems.stream()
                .map(InventoryItem::getLocation)
                .distinct()
                .count();
        
        Integer distinctSuppliers = (int) activeItems.stream()
                .map(InventoryItem::getSupplier)
                .filter(supplier -> supplier != null && !supplier.isEmpty())
                .distinct()
                .count();
        
        return InventoryStatsDto.builder()
                .totalItems(totalItems)
                .totalValue(totalValue != null ? totalValue : 0.0)
                .totalQuantity(totalQuantity)
                .lowStockItemsCount(lowStockCount)
                .distinctLocationsCount(distinctLocations)
                .distinctSuppliersCount(distinctSuppliers)
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public InventoryStatsDto getInventoryStatsByLocation(String location) {
        log.info("Calculating inventory statistics for location: {}", location);
        
        List<InventoryItem> locationItems = inventoryRepository.findByLocationAndIsActiveTrue(location);
        Double totalValue = inventoryRepository.getTotalInventoryValueByLocation(location);
        
        Integer totalQuantity = locationItems.stream()
                .mapToInt(InventoryItem::getQty)
                .sum();
        
        Long lowStockCount = locationItems.stream()
                .filter(item -> item.getQty() <= 10) // Default threshold of 10
                .count();
        
        Integer distinctSuppliers = (int) locationItems.stream()
                .map(InventoryItem::getSupplier)
                .filter(supplier -> supplier != null && !supplier.isEmpty())
                .distinct()
                .count();
        
        return InventoryStatsDto.builder()
                .totalItems((long) locationItems.size())
                .totalValue(totalValue != null ? totalValue : 0.0)
                .totalQuantity(totalQuantity)
                .lowStockItemsCount(lowStockCount)
                .distinctLocationsCount(1) // Only one location
                .distinctSuppliersCount(distinctSuppliers)
                .build();
    }
    
    @Override
    public InventoryItemDto updateInventoryQuantity(Long id, Integer newQuantity) {
        log.info("Updating inventory quantity for item ID: {} to quantity: {}", id, newQuantity);
        
        InventoryItem inventoryItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for quantity update with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        inventoryItem.setQty(newQuantity);
        // Recalculate total cost if unit price is available
        if (inventoryItem.getUnitPrice() != null) {
            inventoryItem.setTotalCost(inventoryItem.getUnitPrice() * newQuantity);
        }
        
        InventoryItem updatedItem = inventoryRepository.save(inventoryItem);
        
        log.info("Successfully updated inventory quantity for item ID: {}", id);
        return inventoryMapper.toDto(updatedItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductFromCatalog(Long productId) {
        log.info("Fetching product from catalog service with ID: {}", productId);
        try {
            ProductDto product = catalogServiceClient.getProductById(productId);
            log.info("Successfully fetched product from catalog: {}", product.getName());
            return product;
        } catch (Exception e) {
            log.error("Failed to fetch product from catalog service for ID: {}", productId, e);
            throw new RuntimeException("Failed to fetch product from catalog service", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductFromCatalogByBarcode(String barcode) {
        log.info("Fetching product from catalog service by barcode: {}", barcode);
        try {
            ProductDto product = catalogServiceClient.getProductByBarcode(barcode);
            log.info("Successfully fetched product from catalog by barcode: {}", product.getName());
            return product;
        } catch (Exception e) {
            log.error("Failed to fetch product from catalog service by barcode: {}", barcode, e);
            throw new RuntimeException("Failed to fetch product from catalog service by barcode", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public TenantDto getTenantFromTenantService(Long tenantId) {
        log.info("Fetching tenant from tenant service with ID: {}", tenantId);
        try {
            TenantDto tenant = tenantServiceClient.getTenantById(tenantId);
            log.info("Successfully fetched tenant from tenant service: {}", tenant.getName());
            return tenant;
        } catch (Exception e) {
            log.error("Failed to fetch tenant from tenant service for ID: {}", tenantId, e);
            throw new RuntimeException("Failed to fetch tenant from tenant service", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public BranchDto getBranchFromTenantService(Long branchId) {
        log.info("Fetching branch from tenant service with ID: {}", branchId);
        try {
            BranchDto branch = tenantServiceClient.getBranchById(branchId);
            log.info("Successfully fetched branch from tenant service: {}", branch.getName());
            return branch;
        } catch (Exception e) {
            log.error("Failed to fetch branch from tenant service for ID: {}", branchId, e);
            throw new RuntimeException("Failed to fetch branch from tenant service", e);
        }
    }
    
    @Override
    public InventoryItemDto createInventoryItemWithProductValidation(CreateInventoryItemDto createInventoryItemDto) {
        log.info("Creating inventory item with product validation from catalog service");
        
        // Validate product exists in catalog service using product SKU
        if (createInventoryItemDto.getProductSku() != null && !createInventoryItemDto.getProductSku().isEmpty()) {
            try {
                ProductDto product = catalogServiceClient.getProductByBarcode(createInventoryItemDto.getProductSku());
                log.info("Product validation successful for product: {}", product.getName());
            } catch (Exception e) {
                log.error("Product validation failed for product SKU: {}", createInventoryItemDto.getProductSku(), e);
                throw new RuntimeException("Product not found in catalog service", e);
            }
        }
        
        // Create inventory item
        InventoryItem inventoryItem = inventoryMapper.toEntity(createInventoryItemDto);
        InventoryItem savedItem = inventoryRepository.save(inventoryItem);
        
        log.info("Successfully created inventory item with product validation, ID: {}", savedItem.getId());
        return inventoryMapper.toDto(savedItem);
    }
    
    @Override
    public InventoryItemDto updateInventoryWithNotification(Long id, UpdateInventoryItemDto updateInventoryItemDto) {
        log.info("Updating inventory item with notification for ID: {}", id);
        
        InventoryItem existingItem = inventoryRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> {
                    log.error("Inventory item not found for update with ID: {}", id);
                    return new RuntimeException("Inventory item not found with ID: " + id);
                });
        
        // Store old quantity for comparison
        Integer oldQuantity = existingItem.getQty();
        
        inventoryMapper.updateEntityFromDto(updateInventoryItemDto, existingItem);
        InventoryItem updatedItem = inventoryRepository.save(existingItem);
        
        // Check for low stock and send notification
        Integer newQuantity = updatedItem.getQty();
        Integer lowStockThreshold = 10; // This could be configurable
        
        if (newQuantity <= lowStockThreshold && newQuantity < oldQuantity) {
            log.info("Low stock detected for item ID: {}, quantity: {}", id, newQuantity);
            
            // Publish low stock alert via RabbitMQ
            InventoryItemDto itemDto = inventoryMapper.toDto(updatedItem);
            rabbitMQPublisher.publishLowStockAlert(itemDto, lowStockThreshold);
            
            // Publish notification alert
            rabbitMQPublisher.publishNotificationAlert(
                itemDto, 
                "LOW_STOCK", 
                "Low stock alert: " + itemDto.getProductName() + " has only " + newQuantity + " units remaining"
            );
        }
        
        log.info("Successfully updated inventory item with notification for ID: {}", id);
        return inventoryMapper.toDto(updatedItem);
    }
} 