package com.retail.ordering.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackagingResponse {
    private Long id;
    private String type;
    private String material;
    private Boolean isEcoFriendly;
}
