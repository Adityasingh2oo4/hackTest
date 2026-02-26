package com.retail.ordering.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "packaging")
public class Packaging {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String type; // Box, Bag, Wrap, Container

    @Column
    private String material; // Cardboard, Plastic, Paper, Foil

    @Column(nullable = false)
    @Builder.Default
    private Boolean isEcoFriendly = false;
}
