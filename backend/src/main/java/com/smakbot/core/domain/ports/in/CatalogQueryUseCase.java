package com.smakbot.core.domain.ports.in;

import com.smakbot.core.domain.model.Product;

import java.util.List;
import java.util.UUID;

/** Consulta, alta, modificación y baja de catálogo por tenant. */
public interface CatalogQueryUseCase {

    List<Product> listProducts(String tenantId);

    Product createProduct(Product product);

    Product updateProduct(UUID id, Product product);

    void deleteProduct(UUID id);

    Product toggleProductStatus(UUID id, boolean active);
}

