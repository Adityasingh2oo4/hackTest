package com.retail.ordering.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackagingRequest {
    @NotBlank(message = "Packaging type is required")
    private String type;
    private String material;
    private Boolean isEcoFriendly;
}
