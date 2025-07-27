package com.market_os.inventory_service.config;

import com.market_os.inventory_service.dto.InventoryItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RabbitMQPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishStockUpdate(InventoryItemDto inventoryItem) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("itemId", inventoryItem.getId());
            message.put("productSku", inventoryItem.getProductSku());
            message.put("quantity", inventoryItem.getQty());
            message.put("location", inventoryItem.getLocation());
            message.put("timestamp", System.currentTimeMillis());
            message.put("eventType", "STOCK_UPDATE");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.INVENTORY_EXCHANGE,
                    RabbitMQConfig.STOCK_UPDATE_ROUTING_KEY,
                    message
            );
            
            log.info("Published stock update for item ID: {}, SKU: {}", 
                    inventoryItem.getId(), inventoryItem.getProductSku());
        } catch (Exception e) {
            log.error("Failed to publish stock update for item ID: {}", inventoryItem.getId(), e);
        }
    }

    public void publishLowStockAlert(InventoryItemDto inventoryItem, Integer threshold) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("itemId", inventoryItem.getId());
            message.put("productSku", inventoryItem.getProductSku());
            message.put("productName", inventoryItem.getProductName());
            message.put("currentQuantity", inventoryItem.getQty());
            message.put("threshold", threshold);
            message.put("location", inventoryItem.getLocation());
            message.put("timestamp", System.currentTimeMillis());
            message.put("eventType", "LOW_STOCK_ALERT");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.INVENTORY_EXCHANGE,
                    RabbitMQConfig.LOW_STOCK_ROUTING_KEY,
                    message
            );
            
            log.info("Published low stock alert for item ID: {}, SKU: {}, Quantity: {}", 
                    inventoryItem.getId(), inventoryItem.getProductSku(), inventoryItem.getQty());
        } catch (Exception e) {
            log.error("Failed to publish low stock alert for item ID: {}", inventoryItem.getId(), e);
        }
    }

    public void publishNotificationAlert(InventoryItemDto inventoryItem, String alertType, String message) {
        try {
            Map<String, Object> notificationMessage = new HashMap<>();
            notificationMessage.put("itemId", inventoryItem.getId());
            notificationMessage.put("productSku", inventoryItem.getProductSku());
            notificationMessage.put("productName", inventoryItem.getProductName());
            notificationMessage.put("alertType", alertType);
            notificationMessage.put("message", message);
            notificationMessage.put("timestamp", System.currentTimeMillis());
            notificationMessage.put("eventType", "INVENTORY_NOTIFICATION");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.NOTIFICATION_EXCHANGE,
                    RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                    notificationMessage
            );
            
            log.info("Published notification alert for item ID: {}, Type: {}, Message: {}", 
                    inventoryItem.getId(), alertType, message);
        } catch (Exception e) {
            log.error("Failed to publish notification alert for item ID: {}", inventoryItem.getId(), e);
        }
    }
}