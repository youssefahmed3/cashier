package com.market_os.customerservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Customer data transfer object")
public class

CustomerDto {
    @NotBlank
    @Schema(description = "Customer's full name", example = "Mohamed Ahmed")
    private String name;

    @Email
    @Schema(description = "Customer's email address", example = "mohamed.ahmed@example.com")
    private String email;

    @Schema(description = "Customer's phone number", example = "+201553645371")
    private String phone;
}