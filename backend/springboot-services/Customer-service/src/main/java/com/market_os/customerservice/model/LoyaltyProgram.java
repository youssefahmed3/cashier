package com.market_os.customerservice.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "loyalty_program")
public class LoyaltyProgram {

    public enum Tier {
        BRONZE(0), SILVER(500), GOLD(1500), PLATINUM(3000);

        private final int threshold;

        Tier(int threshold) {
            this.threshold = threshold;
        }

        public int getThreshold() {
            return threshold;
        }

        public static Tier fromPoints(int points) {
            if (points >= PLATINUM.threshold) return PLATINUM;
            if (points >= GOLD.threshold) return GOLD;
            if (points >= SILVER.threshold) return SILVER;
            return BRONZE;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private Integer points = 0;

    @Enumerated(EnumType.STRING)
    private Tier tier = Tier.BRONZE;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;

    @Transient
    private Integer pointsToNextTier;

    @Transient
    private Integer discountPercentage;

    @PostLoad
    private void calculateTierInfo() {
        this.tier = Tier.fromPoints(points);
        this.pointsToNextTier = calculatePointsToNextTier();
        this.discountPercentage = getDiscountForTier();
    }

    private Integer calculatePointsToNextTier() {
        return switch (tier) {
            case BRONZE -> Tier.SILVER.threshold - points;
            case SILVER -> Tier.GOLD.threshold - points;
            case GOLD -> Tier.PLATINUM.threshold - points;
            case PLATINUM -> 0;
        };
    }

    private Integer getDiscountForTier() {
        return switch (tier) {
            case BRONZE -> 0;
            case SILVER -> 5;
            case GOLD -> 10;
            case PLATINUM -> 15;
        };
    }
}