@Service
@RequiredArgsConstructor
public class LoyaltyService {
    private final LoyaltyProgramRepository loyaltyProgramRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public LoyaltyProgram addPoints(Long customerId, int points) {
        if (points <= 0) {
            throw new BusinessException("Points must be positive");
        }

        LoyaltyProgram program = loyaltyProgramRepository.findByCustomerCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found in loyalty program"));

        program.setPoints(program.getPoints() + points);
        updateTier(program);
        return loyaltyProgramRepository.save(program);
    }

    @Transactional
    public LoyaltyProgram redeemPoints(Long customerId, int points) {
        if (points <= 0) {
            throw new BusinessException("Points must be positive");
        }

        LoyaltyProgram program = loyaltyProgramRepository.findByCustomerCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found in loyalty program"));

        if (program.getPoints() < points) {
            throw new BusinessException("Insufficient points");
        }

        program.setPoints(program.getPoints() - points);
        updateTier(program);
        return loyaltyProgramRepository.save(program);
    }

    private void updateTier(LoyaltyProgram program) {
        int points = program.getPoints();
        if (points >= 1000) {
            program.setTier("PLATINUM");
        } else if (points >= 500) {
            program.setTier("GOLD");
        } else if (points >= 100) {
            program.setTier("SILVER");
        } else {
            program.setTier("STANDARD");
        }
    }

    public LoyaltySummaryDTO getLoyaltySummary(Long customerId) {
        return loyaltyProgramRepository.findSummaryByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Loyalty program not found"));
    }
}
