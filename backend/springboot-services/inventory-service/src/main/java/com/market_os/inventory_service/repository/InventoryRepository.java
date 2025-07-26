package com.market_os.inventory_service.repository;

import com.market_os.inventory_service.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    
    /**
     * Find all active inventory items
     */
    List<InventoryItem> findByIsActiveTrue();
    
    /**
     * Find inventory item by ID and active status
     */
    Optional<InventoryItem> findByIdAndIsActiveTrue(Long id);
    
    /**
     * Find inventory items by location
     */
    List<InventoryItem> findByLocationAndIsActiveTrue(String location);
    
    /**
     * Find inventory items by product SKU
     */
    List<InventoryItem> findByProductSkuAndIsActiveTrue(String productSku);
    
    /**
     * Find inventory items by supplier
     */
    List<InventoryItem> findBySupplierAndIsActiveTrue(String supplier);
    
    /**
     * Find inventory items by purchase date range
     */
    List<InventoryItem> findByPurchDateBetweenAndIsActiveTrue(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find inventory items with low stock (quantity below threshold)
     */
    @Query("SELECT i FROM InventoryItem i WHERE i.qty <= :threshold AND i.isActive = true")
    List<InventoryItem> findLowStockItems(@Param("threshold") Integer threshold);
    
    /**
     * Find inventory items by location and product name
     */
    List<InventoryItem> findByLocationAndProductNameContainingIgnoreCaseAndIsActiveTrue(String location, String productName);
    
    /**
     * Get total quantity by product SKU
     */
    @Query("SELECT COALESCE(SUM(i.qty), 0) FROM InventoryItem i WHERE i.productSku = :productSku AND i.isActive = true")
    Integer getTotalQuantityByProductSku(@Param("productSku") String productSku);
    
    /**
     * Get total value of inventory
     */
    @Query("SELECT COALESCE(SUM(i.totalCost), 0.0) FROM InventoryItem i WHERE i.isActive = true")
    Double getTotalInventoryValue();
    
    /**
     * Get total value of inventory by location
     */
    @Query("SELECT COALESCE(SUM(i.totalCost), 0.0) FROM InventoryItem i WHERE i.location = :location AND i.isActive = true")
    Double getTotalInventoryValueByLocation(@Param("location") String location);
} 