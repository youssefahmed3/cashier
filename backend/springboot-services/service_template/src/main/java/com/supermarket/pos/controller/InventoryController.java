@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<StockBatch> addStockBatch(@Valid @RequestBody StockBatchCreateDTO dto) {
        return ResponseEntity.ok(inventoryService.addStockBatch(dto));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockBatch>> getProductStock(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getActiveBatchesByProduct(productId));
    }

    @PatchMapping("/{batchId}/quantity")
    public ResponseEntity<StockBatch> updateStockQuantity(
            @PathVariable Long batchId,
            @RequestParam int change) {
        return ResponseEntity.ok(inventoryService.updateStockQuantity(batchId, change));
    }
  @GetMapping("/discounted")
    public ResponseEntity<List<ProductWithDiscountDTO>> getDiscountedProducts() {
        return ResponseEntity.ok(inventoryService.getProductsWithDiscounts());
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<StockBatch>> getExpiringSoonProducts() {
        return ResponseEntity.ok(inventoryService.getDiscountedItems());
    }
}
