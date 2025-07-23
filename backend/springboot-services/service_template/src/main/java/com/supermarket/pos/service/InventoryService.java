@Service
@RequiredArgsConstructor
public class InventoryService {
    private final StockBatchRepository stockBatchRepository;
    private final ProductRepository productRepository;

    // ... existing methods ...

    public List<StockBatch> getDiscountedItems() {
        return stockBatchRepository.findByExpiryDateBetweenAndIsActiveTrue(
            LocalDate.now(),
            LocalDate.now().plusDays(7)
        );
    }

    @Scheduled(cron = "0 0 9 * * ?") // Runs daily at 9 AM
    public void applyExpiryDiscounts() {
        List<StockBatch> expiringSoon = stockBatchRepository
            .findByExpiryDateBetweenAndIsActiveTrue(
                LocalDate.now(),
                LocalDate.now().plusDays(7)
            );
        
        expiringSoon.forEach(batch -> {
            batch.setDiscountPercent(new BigDecimal("25.00"));
            batch.setCurrentPrice(
                batch.getSellingPrice().multiply(new BigDecimal("0.75"))
                    .setScale(2, RoundingMode.HALF_UP)
            );
            stockBatchRepository.save(batch);
        });
    }

    public List<ProductWithDiscountDTO> getProductsWithDiscounts() {
        return stockBatchRepository.findDiscountedProducts();
    }
}
