package com.retail.ordering.service;

import com.retail.ordering.dto.BrandRequest;
import com.retail.ordering.dto.BrandResponse;
import com.retail.ordering.entity.Brand;
import com.retail.ordering.exception.BadRequestException;
import com.retail.ordering.exception.ResourceNotFoundException;
import com.retail.ordering.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Brand '" + request.getName() + "' already exists");
        }
        Brand brand = Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .build();
        return mapToResponse(brandRepository.save(brand));
    }

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Long id) {
        return mapToResponse(brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id)));
    }

    public BrandResponse updateBrand(Long id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());
        return mapToResponse(brandRepository.save(brand));
    }

    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        brandRepository.delete(brand);
    }

    private BrandResponse mapToResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .build();
    }
}
