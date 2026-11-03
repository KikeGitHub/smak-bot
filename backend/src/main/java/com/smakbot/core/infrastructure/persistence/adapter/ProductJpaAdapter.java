package com.smakbot.core.infrastructure.persistence.adapter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.ports.out.ProductRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.ProductEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ProductJpaAdapter implements ProductRepositoryPort {

    private static final Logger log = LoggerFactory.getLogger(ProductJpaAdapter.class);
    private static final String KEY_PREFIX = "smakbot:catalog:";

    private final SpringDataProductRepository repo;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final Duration catalogTtl;

    public ProductJpaAdapter(
            SpringDataProductRepository repo,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper,
            @Value("${smakbot.redis.catalog-ttl-minutes:60}") long catalogTtlMinutes) {
        this.repo = repo;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.catalogTtl = Duration.ofMinutes(catalogTtlMinutes);
    }

    @Override
    public List<Product> findActiveByTenant(String tenantId) {
        String key = KEY_PREFIX + tenantId;

        // 1. Intento de lectura ultrarrápida en Redis (< 1ms)
        try {
            String json = redisTemplate.opsForValue().get(key);
            if (json != null && !json.isBlank()) {
                List<Product> cached = objectMapper.readValue(json, new TypeReference<List<Product>>() {});
                log.debug("Catálogo de productos para tenant [{}] recuperado desde Redis ({} items)", tenantId, cached.size());
                return cached;
            }
        } catch (Exception ex) {
            log.warn("Fallo al leer catálogo de Redis para tenant [{}]. Fallback a PostgreSQL: {}", tenantId, ex.getMessage());
        }

        // 2. Consulta a PostgreSQL y calentamiento de caché
        List<Product> products = repo.findByTenantIdAndActiveTrue(tenantId).stream().map(this::toDomain).toList();

        try {
            String json = objectMapper.writeValueAsString(products);
            redisTemplate.opsForValue().set(key, json, catalogTtl);
            log.debug("Catálogo para tenant [{}] cacheado en Redis con TTL de {} min", tenantId, catalogTtl.toMinutes());
        } catch (Exception ex) {
            log.warn("No se pudo cachear catálogo en Redis para tenant [{}]: {}", tenantId, ex.getMessage());
        }

        return products;
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsBySku(String tenantId, String sku) {
        return repo.existsByTenantIdAndSkuIgnoreCase(tenantId, sku);
    }

    @Override
    public void deleteById(UUID id) {
        repo.findById(id).ifPresent(entity -> evictCatalogCache(entity.getTenantId()));
        repo.deleteById(id);
    }

    private void evictCatalogCache(String tenantId) {
        if (tenantId == null) return;
        try {
            redisTemplate.delete(KEY_PREFIX + tenantId);
            log.info("Caché de catálogo Redis invalidada para tenant [{}]", tenantId);
        } catch (Exception ex) {
            log.warn("Error al invalidar caché de catálogo para tenant [{}]: {}", tenantId, ex.getMessage());
        }
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
        evictCatalogCache(saved.getTenantId());
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
