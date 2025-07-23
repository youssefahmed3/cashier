@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {
    private final LoyaltyService loyaltyService;

    @PostMapping("/{customerId}/add-points")
    public ResponseEntity<LoyaltyProgram> addPoints(
            @PathVariable Long customerId,
            @RequestParam int points) {
        return ResponseEntity.ok(loyaltyService.addPoints(customerId, points));
    }

    @PostMapping("/{customerId}/redeem-points")
    public ResponseEntity<LoyaltyProgram> redeemPoints(
            @PathVariable Long customerId,
            @RequestParam int points) {
        return ResponseEntity.ok(loyaltyService.redeemPoints(customerId, points));
    }

    @GetMapping("/{customerId}/summary")
    public ResponseEntity<LoyaltySummaryDTO> getSummary(@PathVariable Long customerId) {
        return ResponseEntity.ok(loyaltyService.getLoyaltySummary(customerId));
    }
}
