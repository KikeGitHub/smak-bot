package com.smakbot.core.application.service;

import com.smakbot.core.domain.exception.BusinessRuleException;
import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.ports.in.CatalogQueryUseCase;
import com.smakbot.core.domain.ports.out.ProductRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService implements CatalogQueryUseCase {

    private final ProductRepositoryPort productRepo;

    public CatalogService(ProductRepositoryPort productRepo) {
        this.productRepo = productRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> listProducts(String tenantId) {
        return productRepo.findActiveByTenant(tenantId);
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
        if (productRepo.existsBySku(product.tenantId(), product.sku())) {
            throw new BusinessRuleException("Ya existe un producto con el SKU " + product.sku() + " para el comercio " + product.tenantId());
        }
        return productRepo.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(java.util.UUID id, Product p) {
        Product existing = productRepo.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Producto no encontrado con ID: " + id));

        Product updated = new Product(
                existing.id(),
                existing.tenantId(),
                p.sku() != null ? p.sku() : existing.sku(),
                p.name() != null ? p.name() : existing.name(),
                p.description() != null ? p.description() : existing.description(),
                p.regularPrice() != null ? p.regularPrice() : existing.regularPrice(),
                p.salePrice() != null ? p.salePrice() : existing.salePrice(),
                p.stock(),
                p.dimensions() != null ? p.dimensions() : existing.dimensions(),
                p.weightLimit() != null ? p.weightLimit() : existing.weightLimit(),
                p.colors() != null ? p.colors() : existing.colors(),
                p.category() != null ? p.category() : existing.category(),
                p.keywords() != null ? p.keywords() : existing.keywords(),
                p.images() != null ? p.images() : existing.images(),
                p.active()
        );
        return productRepo.save(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(java.util.UUID id) {
        productRepo.deleteById(id);
    }

    @Override
    @Transactional
    public Product toggleProductStatus(java.util.UUID id, boolean active) {
        Product existing = productRepo.findById(id)
                .orElseThrow(() -> new BusinessRuleException("Producto no encontrado con ID: " + id));

        Product updated = new Product(
                existing.id(),
                existing.tenantId(),
                existing.sku(),
                existing.name(),
                existing.description(),
                existing.regularPrice(),
                existing.salePrice(),
                existing.stock(),
                existing.dimensions(),
                existing.weightLimit(),
                existing.colors(),
                existing.category(),
                existing.keywords(),
                existing.images(),
                active
        );
        return productRepo.save(updated);
    }
}
