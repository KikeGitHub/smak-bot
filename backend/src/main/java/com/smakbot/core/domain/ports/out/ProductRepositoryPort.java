package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepositoryPort {

    List<Product> findActiveByTenant(String tenantId);

    Optional<Product> findById(UUID id);

    boolean existsBySku(String tenantId, String sku);

    Product save(Product product);

    void deleteById(UUID id);
}
