package com.smakbot.core.infrastructure.adapter.in.web;

import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.ports.in.CatalogQueryUseCase;
import com.smakbot.core.infrastructure.adapter.in.web.dto.AdminProductDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/products")
@Tag(name = "Admin Catalog Management", description = "Gestión multitenant del catálogo de productos para el panel SaaS")
public class AdminCatalogController {

    private final CatalogQueryUseCase catalogQueryUseCase;

    public AdminCatalogController(CatalogQueryUseCase catalogQueryUseCase) {
        this.catalogQueryUseCase = catalogQueryUseCase;
    }

    @GetMapping
    @Operation(summary = "Listar catálogo del tenant",
               description = "Obtiene todos los productos activos e inventario del tenant autenticado")
    public ResponseEntity<List<AdminProductDto>> listProducts(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {

        List<Product> products = catalogQueryUseCase.listProducts(tenantId);
        List<AdminProductDto> dtos = products.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @Operation(summary = "Crear o actualizar producto",
               description = "Persiste un nuevo producto en el catálogo del tenant")
    public ResponseEntity<AdminProductDto> createOrUpdateProduct(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestBody AdminProductDto dto) {

        Product domain = new Product(
                dto.getId(),
                tenantId,
                dto.getSku(),
                dto.getName(),
                dto.getDescription(),
                dto.getRegularPrice(),
                dto.getSalePrice(),
                dto.getStock() != null ? dto.getStock() : 0,
                dto.getDimensions(),
                dto.getWeightLimit(),
                dto.getColors(),
                dto.getCategory(),
                dto.getKeywords(),
                dto.getImages(),
                dto.getActive() != null ? dto.getActive() : true
        );

        Product saved = catalogQueryUseCase.createProduct(domain);
        return ResponseEntity.ok(mapToDto(saved));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    @Operation(summary = "Modificar producto existente", description = "Actualiza las especificaciones, precio o stock del producto")
    public ResponseEntity<AdminProductDto> updateProduct(
            @org.springframework.web.bind.annotation.PathVariable("id") java.util.UUID id,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestBody AdminProductDto dto) {

        Product domain = new Product(
                id,
                tenantId,
                dto.getSku(),
                dto.getName(),
                dto.getDescription(),
                dto.getRegularPrice(),
                dto.getSalePrice(),
                dto.getStock() != null ? dto.getStock() : 0,
                dto.getDimensions(),
                dto.getWeightLimit(),
                dto.getColors(),
                dto.getCategory(),
                dto.getKeywords(),
                dto.getImages(),
                dto.getActive() != null ? dto.getActive() : true
        );

        Product updated = catalogQueryUseCase.updateProduct(id, domain);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto del catálogo", description = "Remueve un producto del catálogo del tenant")
    public ResponseEntity<Void> deleteProduct(
            @org.springframework.web.bind.annotation.PathVariable("id") java.util.UUID id,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {

        catalogQueryUseCase.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    @Operation(summary = "Activar o desactivar producto", description = "Alterna la visibilidad del producto en el catálogo comercial")
    public ResponseEntity<AdminProductDto> toggleStatus(
            @org.springframework.web.bind.annotation.PathVariable("id") java.util.UUID id,
            @org.springframework.web.bind.annotation.RequestParam("active") boolean active,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {

        Product updated = catalogQueryUseCase.toggleProductStatus(id, active);
        return ResponseEntity.ok(mapToDto(updated));
    }

    private AdminProductDto mapToDto(Product p) {
        AdminProductDto dto = new AdminProductDto();
        dto.setId(p.id());
        dto.setTenantId(p.tenantId());
        dto.setSku(p.sku());
        dto.setName(p.name());
        dto.setDescription(p.description());
        dto.setRegularPrice(p.regularPrice());
        dto.setSalePrice(p.salePrice());
        dto.setStock(p.stock());
        dto.setDimensions(p.dimensions());
        dto.setWeightLimit(p.weightLimit());
        dto.setColors(p.colors());
        dto.setCategory(p.category());
        dto.setKeywords(p.keywords());
        dto.setImages(p.images());
        dto.setActive(p.active());
        return dto;
    }
}
