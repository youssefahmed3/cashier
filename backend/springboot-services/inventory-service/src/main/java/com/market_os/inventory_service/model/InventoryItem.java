package com.market_os.inventory_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
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
    
    @Column(name = "purch_date", nullable = false)
    private LocalDate purchDate;
    
    @Column(name = "location", nullable = false, length = 255)
    private String location;
    
    @Column(name = "qty", nullable = false)
    private Integer qty;
    
    @Column(name = "product_name", length = 255)
    private String productName;
    
    @Column(name = "product_sku", length = 100)
    private String productSku;
    
    @Column(name = "unit_price")
    private Double unitPrice;
    
    @Column(name = "total_cost")
    private Double totalCost;
    
    @Column(name = "supplier", length = 255)
    private String supplier;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.totalCost == null && this.unitPrice != null && this.qty != null) {
            this.totalCost = this.unitPrice * this.qty;
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        if (this.totalCost == null && this.unitPrice != null && this.qty != null) {
            this.totalCost = this.unitPrice * this.qty;
        }
    }
} 