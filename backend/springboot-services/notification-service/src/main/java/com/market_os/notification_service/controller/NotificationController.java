package com.market_os.notification_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.market_os.notification_service.model.Notification;
import com.market_os.notification_service.repository.NotificationRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/")
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok("Notification marked as read.");
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/unread")
    public ResponseEntity<?> markAsUnRead(@PathVariable Long id) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setRead(false);
            notificationRepository.save(notification);
            return ResponseEntity.ok("Notification marked as unread.");
        }
        return ResponseEntity.notFound().build();
    }

}
