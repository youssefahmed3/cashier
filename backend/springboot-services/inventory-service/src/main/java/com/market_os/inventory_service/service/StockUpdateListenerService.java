package com.market_os.inventory_service.service;

import com.market_os.inventory_service.config.RabbitMQConfig;
import com.market_os.inventory_service.dto.StockUpdateEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockUpdateListenerService {

    private final InventoryService inventoryService;

    /**
     * Listen to stock decrease events from order service
     */
    @RabbitListener(queues = RabbitMQConfig.STOCK_DECREASE_QUEUE)
    public void handleStockDecrease(StockUpdateEvent stockUpdateEvent) {
        try {
            log.info("Received stock decrease event: {}", stockUpdateEvent);
            inventoryService.decreaseStockForOrder(stockUpdateEvent);
            log.info("Successfully processed stock decrease event for order: {}", stockUpdateEvent.getOrderId());
        } catch (Exception e) {
            log.error("Error processing stock decrease event: {}", e.getMessage(), e);
            throw e; // Re-throw to trigger retry mechanism
        }
    }

    /**
     * Listen to stock restock events from order service (refunds)
     */
    @RabbitListener(queues = RabbitMQConfig.STOCK_RESTOCK_QUEUE)
    public void handleStockRestock(StockUpdateEvent stockUpdateEvent) {
        try {
            log.info("Received stock restock event: {}", stockUpdateEvent);
            inventoryService.restockItemsForRefund(stockUpdateEvent);
            log.info("Successfully processed stock restock event for refund: {}", stockUpdateEvent.getRefundId());
        } catch (Exception e) {
            log.error("Error processing stock restock event: {}", e.getMessage(), e);
            throw e; // Re-throw to trigger retry mechanism
        }
    }
} 