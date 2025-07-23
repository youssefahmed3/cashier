package com.supermarket.pos.inventory;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService service;

    @PostMapping
    public Inventory addStock(@RequestBody Inventory inventory) {
        return service.addStock(inventory);
    }

    @GetMapping("/expiring-soon")
    public List<Inventory> getExpiringSoon() {
        return service.getExpiringSoon();
    }

    @GetMapping
    public List<Inventory> getAllInventory() {
        return service.getAllInventory();
    }
}