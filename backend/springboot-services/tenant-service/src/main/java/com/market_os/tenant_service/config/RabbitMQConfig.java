package com.market_os.tenant_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange Names
    public static final String TENANT_EXCHANGE = "tenant.exchange";
    public static final String BRANCH_EXCHANGE = "branch.exchange";
    
    // Queue Names
    public static final String TENANT_CREATED_QUEUE = "tenant.created.queue";
    public static final String TENANT_UPDATED_QUEUE = "tenant.updated.queue";
    public static final String TENANT_DELETED_QUEUE = "tenant.deleted.queue";
    public static final String BRANCH_CREATED_QUEUE = "branch.created.queue";
    public static final String BRANCH_UPDATED_QUEUE = "branch.updated.queue";
    public static final String BRANCH_DELETED_QUEUE = "branch.deleted.queue";
    
    // Routing Keys
    public static final String TENANT_CREATED_ROUTING_KEY = "tenant.created";
    public static final String TENANT_UPDATED_ROUTING_KEY = "tenant.updated";
    public static final String TENANT_DELETED_ROUTING_KEY = "tenant.deleted";
    public static final String BRANCH_CREATED_ROUTING_KEY = "branch.created";
    public static final String BRANCH_UPDATED_ROUTING_KEY = "branch.updated";
    public static final String BRANCH_DELETED_ROUTING_KEY = "branch.deleted";

    // Exchanges
    @Bean
    public TopicExchange tenantExchange() {
        return new TopicExchange(TENANT_EXCHANGE);
    }

    @Bean
    public TopicExchange branchExchange() {
        return new TopicExchange(BRANCH_EXCHANGE);
    }

    // Tenant Queues
    @Bean
    public Queue tenantCreatedQueue() {
        return QueueBuilder.durable(TENANT_CREATED_QUEUE).build();
    }

    @Bean
    public Queue tenantUpdatedQueue() {
        return QueueBuilder.durable(TENANT_UPDATED_QUEUE).build();
    }

    @Bean
    public Queue tenantDeletedQueue() {
        return QueueBuilder.durable(TENANT_DELETED_QUEUE).build();
    }

    // Branch Queues
    @Bean
    public Queue branchCreatedQueue() {
        return QueueBuilder.durable(BRANCH_CREATED_QUEUE).build();
    }

    @Bean
    public Queue branchUpdatedQueue() {
        return QueueBuilder.durable(BRANCH_UPDATED_QUEUE).build();
    }

    @Bean
    public Queue branchDeletedQueue() {
        return QueueBuilder.durable(BRANCH_DELETED_QUEUE).build();
    }

    // Tenant Bindings
    @Bean
    public Binding tenantCreatedBinding() {
        return BindingBuilder
                .bind(tenantCreatedQueue())
                .to(tenantExchange())
                .with(TENANT_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding tenantUpdatedBinding() {
        return BindingBuilder
                .bind(tenantUpdatedQueue())
                .to(tenantExchange())
                .with(TENANT_UPDATED_ROUTING_KEY);
    }

    @Bean
    public Binding tenantDeletedBinding() {
        return BindingBuilder
                .bind(tenantDeletedQueue())
                .to(tenantExchange())
                .with(TENANT_DELETED_ROUTING_KEY);
    }

    // Branch Bindings
    @Bean
    public Binding branchCreatedBinding() {
        return BindingBuilder
                .bind(branchCreatedQueue())
                .to(branchExchange())
                .with(BRANCH_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding branchUpdatedBinding() {
        return BindingBuilder
                .bind(branchUpdatedQueue())
                .to(branchExchange())
                .with(BRANCH_UPDATED_ROUTING_KEY);
    }

    @Bean
    public Binding branchDeletedBinding() {
        return BindingBuilder
                .bind(branchDeletedQueue())
                .to(branchExchange())
                .with(BRANCH_DELETED_ROUTING_KEY);
    }

    // Message Converter
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // RabbitTemplate
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
} 