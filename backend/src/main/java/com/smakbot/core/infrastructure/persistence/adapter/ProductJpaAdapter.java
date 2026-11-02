package com.smakbot.core.infrastructure.persistence.adapter;

import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.ports.out.ProductRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.ProductEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataProductRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductJpaAdapter implements ProductRepositoryPort {

    private final SpringDataProductRepository repo;

    public ProductJpaAdapter(SpringDataProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Product> findActiveByTenant(String tenantId) {
        return repo.findByTenantIdAndActiveTrue(tenantId).stream().map(this::toDomain).toList();
    }

    @Override
    public java.util.Optional<Product> findById(java.util.UUID id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsBySku(String tenantId, String sku) {
        return repo.existsByTenantIdAndSkuIgnoreCase(tenantId, sku);
    }

    @Override
    public void deleteById(java.util.UUID id) {
        repo.deleteById(id);
    }

    @Override
    public Product save(Product p) {
        ProductEntity entity = (p.id() != null)
                ? repo.findById(p.id()).orElseGet(ProductEntity::new)
                : repo.findByTenantIdAndSkuIgnoreCase(p.tenantId(), p.sku()).orElseGet(ProductEntity::new);

        entity.setTenantId(p.tenantId());
        entity.setSku(p.sku());
        entity.setName(p.name());
        entity.setDescription(p.description());
        entity.setRegularPrice(p.regularPrice());
        entity.setSalePrice(p.salePrice());
        entity.setStock(p.stock());
        entity.setDimensions(p.dimensions());
        entity.setWeightLimit(p.weightLimit());
        entity.setColors(p.colors());
        entity.setCategory(p.category());
        entity.setKeywords(p.keywords());
        entity.setImages(p.images());
        entity.setActive(p.active());

        ProductEntity saved = repo.save(entity);
        return toDomain(saved);
    }

    private Product toDomain(ProductEntity e) {
        return new Product(
                e.getId(), e.getTenantId(), e.getSku(), e.getName(), e.getDescription(),
                e.getRegularPrice(), e.getSalePrice(), e.getStock(), e.getDimensions(),
                e.getWeightLimit(), e.getColors(), e.getCategory(), e.getKeywords(), e.getImages(), e.isActive()
        );
    }
}
