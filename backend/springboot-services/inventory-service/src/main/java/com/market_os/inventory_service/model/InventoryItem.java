package com.market_os.inventory_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    
    @Column(name = "inventory_id", unique = true, nullable = false, length = 50)
    private String inventoryId;
    
    @Column(name = "product_id", nullable = false, length = 50)
    private String productId;
    
    @Column(name = "product_name", length = 255)
    private String productName;
    
    @Column(name = "category", length = 100)
    private String category;
    
    @Column(name = "branch_id", nullable = false, length = 50)
    private String branchId;
    
    @Column(name = "tenant_id", length = 50)
    private String tenantId;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    public void prePersist() {
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.inventoryId == null) {
            this.inventoryId = "inv-" + System.currentTimeMillis();
        }
        if (this.tenantId == null) {
            this.tenantId = "default-tenant";
        }
    }
} 