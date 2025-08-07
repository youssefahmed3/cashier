package com.market_os.inventory_service.feign;

import com.market_os.inventory_service.config.FeignConfig;
import com.market_os.inventory_service.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
    name = "catalog-service",
    url = "${app.catalog-service.url}",
    fallback = CatalogServiceFallback.class,
    configuration = FeignConfig.class
)
public interface CatalogServiceClient {
    
    @GetMapping("/products/{id}")
    ProductDto getProductById(@PathVariable Long id);
    
    @GetMapping("/products")
    List<ProductDto> getAllProducts();
    
    @GetMapping("/products/barcode/{barcode}")
    ProductDto getProductByBarcode(@PathVariable String barcode);
} 