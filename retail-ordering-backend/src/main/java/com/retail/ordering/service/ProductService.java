package com.retail.ordering.service;

import com.retail.ordering.dto.BrandResponse;
import com.retail.ordering.dto.PackagingResponse;
import com.retail.ordering.dto.ProductRequest;
import com.retail.ordering.dto.ProductResponse;
import com.retail.ordering.entity.Brand;
import com.retail.ordering.entity.Category;
import com.retail.ordering.entity.Packaging;
import com.retail.ordering.entity.Product;
import com.retail.ordering.exception.ResourceNotFoundException;
import com.retail.ordering.repository.BrandRepository;
import com.retail.ordering.repository.CategoryRepository;
import com.retail.ordering.repository.PackagingRepository;
import com.retail.ordering.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private PackagingRepository packagingRepository;

    @Autowired
    private CategoryService categoryService;

    public ProductResponse createProduct(ProductRequest productRequest) {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + productRequest.getCategoryId()));

        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .stock(productRequest.getStock())
                .imageUrl(productRequest.getImageUrl())
                .category(category)
                .build();

        // Set optional brand
        if (productRequest.getBrandId() != null) {
            Brand brand = brandRepository.findById(productRequest.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Brand not found with id: " + productRequest.getBrandId()));
            product.setBrand(brand);
        }

        // Set optional packaging
        if (productRequest.getPackagingId() != null) {
            Packaging packaging = packagingRepository.findById(productRequest.getPackagingId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Packaging not found with id: " + productRequest.getPackagingId()));
            product.setPackaging(packaging);
        }

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + productRequest.getCategoryId()));

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStock(productRequest.getStock());
        product.setImageUrl(productRequest.getImageUrl());
        product.setCategory(category);

        // Update optional brand
        if (productRequest.getBrandId() != null) {
            Brand brand = brandRepository.findById(productRequest.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Brand not found with id: " + productRequest.getBrandId()));
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }

        // Update optional packaging
        if (productRequest.getPackagingId() != null) {
            Packaging packaging = packagingRepository.findById(productRequest.getPackagingId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Packaging not found with id: " + productRequest.getPackagingId()));
            product.setPackaging(packaging);
        } else {
            product.setPackaging(null);
        }

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse.ProductResponseBuilder builder = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .category(categoryService.mapToCategoryResponse(product.getCategory()));

        if (product.getBrand() != null) {
            builder.brand(BrandResponse.builder()
                    .id(product.getBrand().getId())
                    .name(product.getBrand().getName())
                    .description(product.getBrand().getDescription())
                    .logoUrl(product.getBrand().getLogoUrl())
                    .build());
        }

        if (product.getPackaging() != null) {
            builder.packaging(PackagingResponse.builder()
                    .id(product.getPackaging().getId())
                    .type(product.getPackaging().getType())
                    .material(product.getPackaging().getMaterial())
                    .isEcoFriendly(product.getPackaging().getIsEcoFriendly())
                    .build());
        }

        return builder.build();
    }
}
