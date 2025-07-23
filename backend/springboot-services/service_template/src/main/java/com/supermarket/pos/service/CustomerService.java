@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final LoyaltyProgramRepository loyaltyProgramRepository;

    public Customer createCustomer(CustomerCreateDTO dto) {
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        Customer customer = Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        
        // Initialize loyalty program
        LoyaltyProgram loyaltyProgram = LoyaltyProgram.builder()
                .customer(savedCustomer)
                .points(0)
                .build();
        loyaltyProgramRepository.save(loyaltyProgram);

        return savedCustomer;
    }

    public Customer updateCustomer(Long customerId, CustomerUpdateDTO dto) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (dto.getName() != null) customer.setName(dto.getName());
        if (dto.getPhone() != null) customer.setPhone(dto.getPhone());
        if (dto.getAddress() != null) customer.setAddress(dto.getAddress());

        return customerRepository.save(customer);
    }

    public Page<Customer> searchCustomers(String query, Pageable pageable) {
        return customerRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                query, query, pageable);
    }
}
