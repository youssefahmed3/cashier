package com.market_os.customerservice.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoyaltyEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public LoyaltyEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishPointsChange(Long customerId, int pointsChange) {
        String message = String.format("{\"customerId\": %d, \"pointsChange\": %d}",
                customerId, pointsChange);
        rabbitTemplate.convertAndSend("customer.events",
                "loyalty.points.change",
                message);
    }

    public void publishTierUpgrade(Long customerId, String oldTier, String newTier) {
        String message = String.format("{\"customerId\": %d, \"oldTier\": \"%s\", \"newTier\": \"%s\"}",
                customerId, oldTier, newTier);
        rabbitTemplate.convertAndSend("customer.events",
                "tier.upgrade",
                message);
    }
}