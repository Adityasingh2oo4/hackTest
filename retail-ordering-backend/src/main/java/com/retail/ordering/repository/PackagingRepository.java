package com.retail.ordering.repository;

import com.retail.ordering.entity.Packaging;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PackagingRepository extends JpaRepository<Packaging, Long> {
    Optional<Packaging> findByType(String type);
}
