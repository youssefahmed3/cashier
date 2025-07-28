package com.market_os.catalog_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.market_os.catalog_service.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
