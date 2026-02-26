package com.retail.ordering.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandRequest {
    @NotBlank(message = "Brand name is required")
    private String name;
    private String description;
    private String logoUrl;
}
