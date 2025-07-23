package com.supermarket.pos.inventory;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    private Long productId;
    private int quantity;
    private String location;
    private LocalDate expiryDate;
    private BigDecimal originalPrice;
    private BigDecimal currentPrice;

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void applyDiscountIfExpiring() {
        if (expiryDate != null && expiryDate.isBefore(LocalDate.now().plusDays(30))) {
            currentPrice = originalPrice.multiply(new BigDecimal("0.75")); // 25% discount
        } else {
            currentPrice = originalPrice;
        }
    }
}