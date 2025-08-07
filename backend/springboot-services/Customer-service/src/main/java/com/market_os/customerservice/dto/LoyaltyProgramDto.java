package com.market_os.customerservice.dto;

import com.market_os.customerservice.model.LoyaltyProgram.Tier;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Loyalty program details")
public class LoyaltyProgramDto {

    @Schema(description = "Current loyalty points", example = "750")
    private Integer points;

    @Schema(description = "Current tier", example = "SILVER")
    private Tier tier;

    @Schema(description = "Points needed to reach next tier", example = "750")
    private Integer pointsToNextTier;

    @Schema(description = "Discount percentage based on tier", example = "5")
    private Integer discountPercentage;

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Tier getTier() {
        return tier;
    }

    public void setTier(Tier tier) {
        this.tier = tier;
    }

    public Integer getPointsToNextTier() {
        return pointsToNextTier;
    }

    public void setPointsToNextTier(Integer pointsToNextTier) {
        this.pointsToNextTier = pointsToNextTier;
    }

    public Integer getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
}
