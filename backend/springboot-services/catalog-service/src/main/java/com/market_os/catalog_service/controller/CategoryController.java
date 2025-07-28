package com.market_os.catalog_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.market_os.catalog_service.dto.CategoryDto;
import com.market_os.catalog_service.model.Category;
import com.market_os.catalog_service.model.Product;
import com.market_os.catalog_service.service.CategoryService;
import com.market_os.catalog_service.service.ProductService;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService service;
    private final ProductService productService;

    public CategoryController(CategoryService service, ProductService productService) {
        this.service = service;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        List<Category> categories = service.getAll();
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        Category category = service.getById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody CategoryDto CategoryDto) {
        Category Category = new Category();
        Category.setDescription(CategoryDto.getDescription());
        Category.setName(CategoryDto.getName());
        Category.setProducts(null);
        Category savedCategory = service.save(Category);

        if (savedCategory == null) {
            return ResponseEntity.badRequest().body("Error creating category");
        }
        return ResponseEntity.ok("Category created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody CategoryDto CategoryDto) {
        Category existingCategory = service.getById(id).orElse(null);
        if (existingCategory == null) {
            return ResponseEntity.notFound().build();
        }

        existingCategory.setName(CategoryDto.getName());
        existingCategory.setDescription(CategoryDto.getDescription());
        Category updatedCategory = service.save(existingCategory);
        if (updatedCategory == null) {
            return ResponseEntity.badRequest().body("Error updating category");
        }
        return ResponseEntity.ok("Category updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        Category category = service.getById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        List<Product> products = category.getProducts();
        if (products != null && !products.isEmpty()) {
            for (Product product : products) { /* For Each Loop */
                product.setCategory(null);
                productService.save(product);
            }
        }

        service.delete(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<Product>> getProductsForCategory(@PathVariable Long id) {
        Category category = service.getById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        List<Product> products = category.getProducts();

        if (products == null || products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }
}
