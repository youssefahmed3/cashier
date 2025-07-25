package com.market_os.catalog_service.mapper;

import com.market_os.catalog_service.dto.ProductResponseDto;
import com.market_os.catalog_service.model.Product;

public class ProductMapper {
    public static ProductResponseDto toDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setBarcode(product.getBarcode());
        dto.setName(product.getName());
        dto.setImgurl(product.getImgurl());
        dto.setIsactive(product.getIsactive());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        return dto;
    }
}
