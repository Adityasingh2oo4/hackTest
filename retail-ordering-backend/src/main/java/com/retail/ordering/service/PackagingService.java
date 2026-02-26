package com.retail.ordering.service;

import com.retail.ordering.dto.PackagingRequest;
import com.retail.ordering.dto.PackagingResponse;
import com.retail.ordering.entity.Packaging;
import com.retail.ordering.exception.BadRequestException;
import com.retail.ordering.exception.ResourceNotFoundException;
import com.retail.ordering.repository.PackagingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackagingService {

    @Autowired
    private PackagingRepository packagingRepository;

    public PackagingResponse createPackaging(PackagingRequest request) {
        if (packagingRepository.findByType(request.getType()).isPresent()) {
            throw new BadRequestException("Packaging type '" + request.getType() + "' already exists");
        }
        Packaging packaging = Packaging.builder()
                .type(request.getType())
                .material(request.getMaterial())
                .isEcoFriendly(request.getIsEcoFriendly() != null ? request.getIsEcoFriendly() : false)
                .build();
        return mapToResponse(packagingRepository.save(packaging));
    }

    public List<PackagingResponse> getAllPackaging() {
        return packagingRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public PackagingResponse getPackagingById(Long id) {
        return mapToResponse(packagingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Packaging not found with id: " + id)));
    }

    public PackagingResponse updatePackaging(Long id, PackagingRequest request) {
        Packaging packaging = packagingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Packaging not found with id: " + id));
        packaging.setType(request.getType());
        packaging.setMaterial(request.getMaterial());
        if (request.getIsEcoFriendly() != null) {
            packaging.setIsEcoFriendly(request.getIsEcoFriendly());
        }
        return mapToResponse(packagingRepository.save(packaging));
    }

    public void deletePackaging(Long id) {
        Packaging packaging = packagingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Packaging not found with id: " + id));
        packagingRepository.delete(packaging);
    }

    private PackagingResponse mapToResponse(Packaging packaging) {
        return PackagingResponse.builder()
                .id(packaging.getId())
                .type(packaging.getType())
                .material(packaging.getMaterial())
                .isEcoFriendly(packaging.getIsEcoFriendly())
                .build();
    }
}
