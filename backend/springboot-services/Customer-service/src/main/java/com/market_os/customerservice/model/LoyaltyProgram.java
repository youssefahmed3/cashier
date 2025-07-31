package com.market_os.customerservice.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
        switch (tier) {
            case BRONZE:
                return Tier.SILVER.threshold - points;
            case SILVER:
                return Tier.GOLD.threshold - points;
            case GOLD:
                return Tier.PLATINUM.threshold - points;
            case PLATINUM:
                return 0;
            default:
                throw new IllegalStateException("Unknown tier: " + tier);
        }
    }

    private Integer getDiscountForTier() {
        switch (tier) {
            case BRONZE: return 0;
            case SILVER: return 5;
            case GOLD: return 10;
            case PLATINUM: return 15;
            default: throw new IllegalStateException("Unknown tier: " + tier);
        }
    }

    // Add getters and setters below
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Tier getTier() { return tier; }
    public void setTier(Tier tier) { this.tier = tier; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public Integer getPointsToNextTier() { return pointsToNextTier; }
    public void setPointsToNextTier(Integer pointsToNextTier) { this.pointsToNextTier = pointsToNextTier; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }
}
