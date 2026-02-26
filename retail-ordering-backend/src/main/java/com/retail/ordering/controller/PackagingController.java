package com.retail.ordering.controller;

import com.retail.ordering.dto.PackagingRequest;
import com.retail.ordering.dto.PackagingResponse;
import com.retail.ordering.service.PackagingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packaging")
public class PackagingController {

    @Autowired
    private PackagingService packagingService;

    @GetMapping
    public ResponseEntity<List<PackagingResponse>> getAllPackaging() {
        return ResponseEntity.ok(packagingService.getAllPackaging());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackagingResponse> getPackagingById(@PathVariable Long id) {
        return ResponseEntity.ok(packagingService.getPackagingById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PackagingResponse> createPackaging(@Valid @RequestBody PackagingRequest request) {
        return new ResponseEntity<>(packagingService.createPackaging(request), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PackagingResponse> updatePackaging(@PathVariable Long id,
            @Valid @RequestBody PackagingRequest request) {
        return ResponseEntity.ok(packagingService.updatePackaging(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackaging(@PathVariable Long id) {
        packagingService.deletePackaging(id);
        return ResponseEntity.noContent().build();
    }
}
