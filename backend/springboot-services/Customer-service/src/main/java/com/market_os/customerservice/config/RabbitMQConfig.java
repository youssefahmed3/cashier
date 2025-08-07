package com.market_os.customerservice.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange customerEventsExchange() {
        return new TopicExchange("customer.events");
    }

    @Bean
    public Queue loyaltyEventsQueue() {
        return new Queue("loyalty.events.queue");
    }

    @Bean
    public Queue tierUpdatesQueue() {
        return new Queue("tier.updates.queue");
    }

    @Bean
    public Binding loyaltyEventsBinding(Queue loyaltyEventsQueue, TopicExchange exchange) {
        return BindingBuilder.bind(loyaltyEventsQueue)
                .to(exchange)
                .with("loyalty.*");
    }

    @Bean
    public Binding tierUpdatesBinding(Queue tierUpdatesQueue, TopicExchange exchange) {
        return BindingBuilder.bind(tierUpdatesQueue)
                .to(exchange)
                .with("tier.*");
    }
}