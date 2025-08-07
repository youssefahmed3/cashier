package com.market_os.customerservice.service;

import com.market_os.customerservice.dto.CustomerDto;
import com.market_os.customerservice.dto.LoyaltyProgramDto;
import com.market_os.customerservice.exception.ResourceNotFoundException;
import com.market_os.customerservice.model.Customer;
import com.market_os.customerservice.model.LoyaltyProgram;
import com.market_os.customerservice.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public Customer createCustomer(CustomerDto customerDto) {
        if (customerDto.getEmail() != null && customerRepository.findByEmail(customerDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        Customer customer = new Customer();
        customer.setName(customerDto.getName());
        customer.setEmail(customerDto.getEmail());
        customer.setPhone(customerDto.getPhone());

        LoyaltyProgram loyaltyProgram = new LoyaltyProgram();
        loyaltyProgram.setCustomer(customer);
        customer.setLoyaltyProgram(loyaltyProgram);

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Transactional
    public Customer updateCustomer(Long id, CustomerDto customerDto) {
        Customer customer = getCustomerById(id);

        if (customerDto.getName() != null) {
            customer.setName(customerDto.getName());
        }
        if (customerDto.getEmail() != null && !customerDto.getEmail().equals(customer.getEmail())) {
            if (customerRepository.findByEmail(customerDto.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
            customer.setEmail(customerDto.getEmail());
        }
        if (customerDto.getPhone() != null) {
            customer.setPhone(customerDto.getPhone());
        }

        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public LoyaltyProgramDto getLoyaltyProgram(Long customerId) {
        Customer customer = getCustomerById(customerId);
        LoyaltyProgram loyaltyProgram = customer.getLoyaltyProgram();

        LoyaltyProgramDto dto = new LoyaltyProgramDto();
        dto.setPoints(loyaltyProgram.getPoints());
        dto.setTier(loyaltyProgram.getTier());
        dto.setPointsToNextTier(loyaltyProgram.getPointsToNextTier());
        dto.setDiscountPercentage(loyaltyProgram.getDiscountPercentage());

        return dto;
    }

    @Transactional
    public LoyaltyProgramDto addLoyaltyPoints(Long customerId, Integer pointsToAdd) {
        Customer customer = getCustomerById(customerId);
        LoyaltyProgram loyaltyProgram = customer.getLoyaltyProgram();

        loyaltyProgram.setPoints(loyaltyProgram.getPoints() + pointsToAdd);
        customerRepository.save(customer);

        return getLoyaltyProgram(customerId);
}
}