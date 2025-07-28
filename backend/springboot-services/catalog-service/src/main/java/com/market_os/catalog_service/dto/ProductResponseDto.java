package com.market_os.catalog_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

/* I Used lombok to generate getters, setters and constructors */
public class ProductResponseDto {
    private Long id;
    private String description;
    private Double price;
    private String barcode;
    private String name;
    private String imgurl;
    private Boolean isactive;
    private Long categoryId;
}