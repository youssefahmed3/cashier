package com.market_os.catalog_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.market_os.catalog_service.model.Category;
import com.market_os.catalog_service.repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<Category> getAll() {
        return repo.findAll();
    }

    public Optional<Category> getById(Long id) {
        return repo.findById(id);
        
    }

    public Category save(Category category) {
        return repo.save(category);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }    
}
