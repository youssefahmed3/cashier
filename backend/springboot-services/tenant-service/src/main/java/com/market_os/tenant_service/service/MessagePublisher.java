package com.market_os.tenant_service.service;

import com.market_os.tenant_service.config.RabbitMQConfig;
import com.market_os.tenant_service.dto.events.BranchEvent;
import com.market_os.tenant_service.dto.events.TenantEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessagePublisher {
    
    private final RabbitTemplate rabbitTemplate;
    
    public void publishTenantCreated(TenantEvent event) {
        try {
            log.info("Publishing tenant created event: {}", event.getTenantId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.TENANT_EXCHANGE,
                    RabbitMQConfig.TENANT_CREATED_ROUTING_KEY,
                    event
            );
            log.info("Successfully published tenant created event: {}", event.getTenantId());
        } catch (Exception e) {
            log.error("Failed to publish tenant created event: {}", event.getTenantId(), e);
        }
    }
    
    public void publishTenantUpdated(TenantEvent event) {
        try {
            log.info("Publishing tenant updated event: {}", event.getTenantId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.TENANT_EXCHANGE,
                    RabbitMQConfig.TENANT_UPDATED_ROUTING_KEY,
                    event
            );
            log.info("Successfully published tenant updated event: {}", event.getTenantId());
        } catch (Exception e) {
            log.error("Failed to publish tenant updated event: {}", event.getTenantId(), e);
        }
    }
    
    public void publishTenantDeleted(TenantEvent event) {
        try {
            log.info("Publishing tenant deleted event: {}", event.getTenantId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.TENANT_EXCHANGE,
                    RabbitMQConfig.TENANT_DELETED_ROUTING_KEY,
                    event
            );
            log.info("Successfully published tenant deleted event: {}", event.getTenantId());
        } catch (Exception e) {
            log.error("Failed to publish tenant deleted event: {}", event.getTenantId(), e);
        }
    }
    
    public void publishBranchCreated(BranchEvent event) {
        try {
            log.info("Publishing branch created event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.BRANCH_EXCHANGE,
                    RabbitMQConfig.BRANCH_CREATED_ROUTING_KEY,
                    event
            );
            log.info("Successfully published branch created event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId());
        } catch (Exception e) {
            log.error("Failed to publish branch created event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId(), e);
        }
    }
    
    public void publishBranchUpdated(BranchEvent event) {
        try {
            log.info("Publishing branch updated event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.BRANCH_EXCHANGE,
                    RabbitMQConfig.BRANCH_UPDATED_ROUTING_KEY,
                    event
            );
            log.info("Successfully published branch updated event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId());
        } catch (Exception e) {
            log.error("Failed to publish branch updated event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId(), e);
        }
    }
    
    public void publishBranchDeleted(BranchEvent event) {
        try {
            log.info("Publishing branch deleted event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.BRANCH_EXCHANGE,
                    RabbitMQConfig.BRANCH_DELETED_ROUTING_KEY,
                    event
            );
            log.info("Successfully published branch deleted event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId());
        } catch (Exception e) {
            log.error("Failed to publish branch deleted event: {} for tenant: {}", 
                     event.getBranchId(), event.getTenantId(), e);
        }
    }
} 