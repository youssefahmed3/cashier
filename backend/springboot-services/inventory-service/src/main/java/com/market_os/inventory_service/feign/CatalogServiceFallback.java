package com.market_os.inventory_service.feign;

import com.market_os.inventory_service.dto.ProductDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class CatalogServiceFallback implements CatalogServiceClient {
    
    @Override
    public ProductDto getProductById(Long id) {
        log.error("Catalog service is unavailable, falling back to null for product ID: {}", id);
        return null;
    }
    
    @Override
    public List<ProductDto> getAllProducts() {
        log.error("Catalog service is unavailable, falling back to empty list for all products");
        return new ArrayList<>();
    }
    
    @Override
    public ProductDto getProductByBarcode(String barcode) {
        log.error("Catalog service is unavailable, falling back to null for barcode: {}", barcode);
        return null;
    }
} 