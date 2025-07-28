package com.market_os.inventory_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange Names
    public static final String INVENTORY_EXCHANGE = "inventory.exchange";
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";

    // Queue Names
    public static final String INVENTORY_STOCK_QUEUE = "inventory.stock.queue";
    public static final String INVENTORY_LOW_STOCK_QUEUE = "inventory.low-stock.queue";
    public static final String INVENTORY_NOTIFICATION_QUEUE = "inventory.notification.queue";

    // Routing Keys
    public static final String STOCK_UPDATE_ROUTING_KEY = "inventory.stock.update";
    public static final String LOW_STOCK_ROUTING_KEY = "inventory.stock.low";
    public static final String NOTIFICATION_ROUTING_KEY = "notification.inventory";

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter());
        return factory;
    }

    // Exchanges
    @Bean
    public TopicExchange inventoryExchange() {
        return new TopicExchange(INVENTORY_EXCHANGE);
    }

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }

    // Queues
    @Bean
    public Queue inventoryStockQueue() {
        return QueueBuilder.durable(INVENTORY_STOCK_QUEUE).build();
    }

    @Bean
    public Queue inventoryLowStockQueue() {
        return QueueBuilder.durable(INVENTORY_LOW_STOCK_QUEUE).build();
    }

    @Bean
    public Queue inventoryNotificationQueue() {
        return QueueBuilder.durable(INVENTORY_NOTIFICATION_QUEUE).build();
    }

    // Bindings
    @Bean
    public Binding stockUpdateBinding() {
        return BindingBuilder
                .bind(inventoryStockQueue())
                .to(inventoryExchange())
                .with(STOCK_UPDATE_ROUTING_KEY);
    }

    @Bean
    public Binding lowStockBinding() {
        return BindingBuilder
                .bind(inventoryLowStockQueue())
                .to(inventoryExchange())
                .with(LOW_STOCK_ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding() {
        return BindingBuilder
                .bind(inventoryNotificationQueue())
                .to(notificationExchange())
                .with(NOTIFICATION_ROUTING_KEY);
    }
}