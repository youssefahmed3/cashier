package com.supermarket.pos.inventory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository repository;

    @Transactional
    public Inventory addStock(Inventory inventory) {
        inventory.setCurrentPrice(inventory.getOriginalPrice());
        return repository.save(inventory);
    }

    public List<Inventory> getExpiringSoon() {
        LocalDate threshold = LocalDate.now().plusDays(30);
        return repository.findByExpiryDateBefore(threshold);
    }

    public List<Inventory> getAllInventory() {
        return repository.findAll();
    }
}