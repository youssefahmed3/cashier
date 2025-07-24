package com.market_os.product_service.controller;

import com.market_os.product_service.dto.ProductDto;
import com.market_os.product_service.model.Product;
import com.market_os.product_service.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id).orElse(null);
    }

    @PostMapping
    public Product create(@RequestBody ProductDto productDto) {
        Product product = new Product();
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setBarcode(productDto.getBarcode());
        product.setName(productDto.getName());
        product.setImgurl(productDto.getImgurl());
        product.setIsactive(productDto.getIsactive());
        return service.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return service.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
