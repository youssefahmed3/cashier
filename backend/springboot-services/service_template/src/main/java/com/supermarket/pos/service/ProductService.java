package com.supermarket.pos.service;

import com.supermarket.pos.dto.ProductCreateDTO;
import com.supermarket.pos.dto.ProductUpdateDTO;
import com.supermarket.pos.exception.ResourceNotFoundException;
import com.supermarket.pos.model.Product;
import com.supermarket.pos.model.ProductCategory;
import com.supermarket.pos.repository.ProductCategoryRepository;
import com.supermarket.pos.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getActiveProducts() {
        return productRepository.findAllActiveProducts();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));
    }

    @Transactional
    public Product createProduct(ProductCreateDTO productDTO) {
        ProductCategory category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));

        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .costPrice(productDTO.getCostPrice())
                .barcode(productDTO.getBarcode())
                .category(category)
                .isActive(true)
                .build();

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductUpdateDTO productDTO) {
        Product product = getProductById(id);
        
        if (productDTO.getName() != null) {
            product.setName(productDTO.getName());
        }
        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }
        if (productDTO.getPrice() != null) {
            product.setPrice(productDTO.getPrice());
        }
        if (productDTO.getCostPrice() != null) {
            product.setCostPrice(productDTO.getCostPrice());
        }
        if (productDTO.getBarcode() != null) {
            product.setBarcode(productDTO.getBarcode());
        }
        if (productDTO.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
            product.setCategory(category);
        }
        if (productDTO.getIsActive() != null) {
            product.setIsActive(productDTO.getIsActive());
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
    }
}
