package com.market_os.customerservice.controller;

import com.market_os.customerservice.dto.CustomerDto;
import com.market_os.customerservice.dto.LoyaltyProgramDto;
import com.market_os.customerservice.model.Customer;
import com.market_os.customerservice.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customer Management", description = "Manage supermarket customers and loyalty programs")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    @Operation(summary = "Create a new customer")
    public ResponseEntity<Customer> createCustomer(@RequestBody CustomerDto customerDto) {
        return ResponseEntity.ok(customerService.createCustomer(customerDto));
    }

    @GetMapping
    @Operation(summary = "Get all customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer details")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerDto customerDto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customerDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{customerId}/loyalty")
    @Operation(summary = "Get loyalty program details")
    public ResponseEntity<LoyaltyProgramDto> getLoyaltyProgram(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getLoyaltyProgram(customerId));
    }

    @PostMapping("/{customerId}/loyalty/points")
    @Operation(summary = "Add loyalty points")
    public ResponseEntity<LoyaltyProgramDto> addLoyaltyPoints(
            @PathVariable Long customerId,
            @RequestParam Integer points) {
        return ResponseEntity.ok(
                customerService.addLoyaltyPoints(customerId, points));
}
}