package com.market_os.notification_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.market_os.notification_service.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
