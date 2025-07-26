package com.market_os.catalog_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.market_os.catalog_service.model.Product;
import com.market_os.catalog_service.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll() {
        return repo.findAll();
    }

    public Optional<Product> getById(Long id) {
        return repo.findById(id);
    }

    public Product save(Product product) {
        return repo.save(product);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

