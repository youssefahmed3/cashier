package com.market_os.catalog_service.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.market_os.catalog_service.dto.ProductDto;
import com.market_os.catalog_service.dto.ProductResponseDto;
import com.market_os.catalog_service.mapper.ProductMapper;
import com.market_os.catalog_service.model.Category;
import com.market_os.catalog_service.model.Product;
import com.market_os.catalog_service.service.CategoryService;
import com.market_os.catalog_service.service.ProductService;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService service;
    private final CategoryService categoryService;

    public ProductController(ProductService service, CategoryService categoryService) {
        this.service = service;
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAll() {
        List<ProductResponseDto> products = service.getAll().stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());

        return products.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Product product = service.getById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody ProductDto productDto) {
        Product product = new Product();
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setBarcode(productDto.getBarcode());
        product.setName(productDto.getName());
        product.setImgurl(productDto.getImgurl());
        product.setIsactive(productDto.getIsactive());
        Product savedProduct = service.save(product);

        if (savedProduct != null && savedProduct.getId() != null) {
            return ResponseEntity
                    .status(201)
                    .body("Product created successfully");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody ProductDto productDto) {
        Product existingProduct = service.getById(id).orElse(null);

        if (existingProduct != null) {
            existingProduct.setDescription(productDto.getDescription());
            existingProduct.setPrice(productDto.getPrice());
            existingProduct.setBarcode(productDto.getBarcode());
            existingProduct.setName(productDto.getName());
            existingProduct.setImgurl(productDto.getImgurl());
            existingProduct.setIsactive(productDto.getIsactive());
            service.save(existingProduct);
            return ResponseEntity.ok("Product updated successfully");

        } else {
            return ResponseEntity.notFound().build();

        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        Product product = service.getById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<String> activate(@PathVariable Long id) {
        Product product = service.getById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        if (product.getIsactive()) {
            return ResponseEntity.badRequest().body("Product is already active");
        }

        product.setIsactive(true);
        service.save(product);
        return ResponseEntity.ok("Product activated successfully");
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<String> disable(@PathVariable Long id) {
        Product product = service.getById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        if (!product.getIsactive()) {
            return ResponseEntity.badRequest().body("Product is already disabled");
        }

        product.setIsactive(false);
        service.save(product);
        return ResponseEntity.ok("Product disabled successfully");
    }

    @GetMapping("/{id}/category")
    public ResponseEntity<Category> getCategoryForProduct(@PathVariable Long id) {
        /*
         * Product product = service.getById(id).orElse(null);
         * return product != null ? product.getCategory() : null;
         */
        Product product = service.getById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        Category category = product.getCategory();
        if (category == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{productId}/category/{categoryId}")
    public ResponseEntity<String> assignCategory(@PathVariable Long productId, @PathVariable Long categoryId) {
        Product product = service.getById(productId).orElse(null);
        Category category = categoryService.getById(categoryId).orElse(null);

        if (product == null || category == null) {
            return ResponseEntity.status(404).body("Product or Category not found");
        }

        if (product.getCategory() != null && product.getCategory().getId().equals(categoryId)) {
            return ResponseEntity.ok("Product is already assigned to this category");
        }

        product.setCategory(category);
        service.save(product);

        return ResponseEntity.ok("Category has been assigned successfully to the product");
    }

}
