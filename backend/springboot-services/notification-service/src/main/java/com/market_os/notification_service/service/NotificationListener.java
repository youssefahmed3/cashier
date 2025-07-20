package com.market_os.notification_service.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.market_os.notification_service.dto.OrderCreatedEvent;
import com.market_os.notification_service.model.Notification;
import com.market_os.notification_service.repository.NotificationRepository;

import java.time.LocalDateTime;

@Service
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    public NotificationListener(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @RabbitListener(queues = "order.created")
    public void handleOrderCreated(OrderCreatedEvent event) {
        Notification notification = new Notification();
        notification.setTitle("New Order Placed");
        notification.setCategory("order.created"); // ✅ clearer, aligned with event
        notification.setMessage("Order Placed");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        System.out.println("🔔 Notification Saved for Order: " + event.getOrderId());
    }
}
