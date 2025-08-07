package com.market_os.inventory_service.repository;

import com.market_os.inventory_service.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
     * Find inventory items by product ID
     */
    List<InventoryItem> findByProductIdAndIsActiveTrue(String productId);
    
    /**
     * Find inventory items by branch ID
     */
    List<InventoryItem> findByBranchIdAndIsActiveTrue(String branchId);
    
    /**
     * Find inventory items by tenant ID
     */
    List<InventoryItem> findByTenantIdAndIsActiveTrue(String tenantId);
    
    /**
     * Find inventory items with low stock (quantity below threshold)
     */
    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= :threshold AND i.isActive = true")
    List<InventoryItem> findLowStockItems(@Param("threshold") Integer threshold);
    
    /**
     * Find inventory items by product ID and branch ID
     */
    List<InventoryItem> findByProductIdAndBranchIdAndIsActiveTrue(String productId, String branchId);
    
    /**
     * Get total quantity by product ID
     */
    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM InventoryItem i WHERE i.productId = :productId AND i.isActive = true")
    Integer getTotalQuantityByProductId(@Param("productId") String productId);
    
    /**
     * Get total quantity by product ID and branch ID
     */
    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM InventoryItem i WHERE i.productId = :productId AND i.branchId = :branchId AND i.isActive = true")
    Integer getTotalQuantityByProductIdAndBranchId(@Param("productId") String productId, @Param("branchId") String branchId);
    
    /**
     * Find inventory items by product ID (for stock updates)
     */
    @Query("SELECT i FROM InventoryItem i WHERE i.productId = :productId AND i.isActive = true ORDER BY i.createdAt ASC")
    List<InventoryItem> findByProductIdOrderByCreatedAtAsc(@Param("productId") String productId);
    
    /**
     * Update quantity for inventory item
     */
    @Query("UPDATE InventoryItem i SET i.quantity = i.quantity + :quantityChange, i.lastUpdated = CURRENT_TIMESTAMP WHERE i.id = :id AND i.isActive = true")
    void updateQuantityById(@Param("id") Long id, @Param("quantityChange") Integer quantityChange);
} 