package com.smakbot.core.infrastructure.adapter.out.openai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.domain.ports.out.ProductVisionPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OpenAiProductVisionAdapterTest {

    @Test
    @DisplayName("Debe manejar graciosamente imagen vacía sin lanzar excepciones")
    void testEmptyImageBytes() {
        OpenAiProductVisionAdapter adapter = new OpenAiProductVisionAdapter("", "gpt-4o-mini", "https://api.openai.com/v1", new ObjectMapper());
        ProductVisionPort.ProductVisionResult res = adapter.analyzeImage(new byte[0], "image/jpeg", "quiero una");

        assertNotNull(res);
        assertNull(res.sku());
        assertNull(res.productName());
        assertFalse(res.hasSku());
        assertEquals("quiero una", res.summary());
    }

    @Test
    @DisplayName("Debe detectar correctamente si tiene SKU o producto en el record")
    void testRecordHelpers() {
        ProductVisionPort.ProductVisionResult resWithSku = new ProductVisionPort.ProductVisionResult("EZRY123", "Silla de Oficina", 995.0, "Silla de oficina EZRY123");
        assertTrue(resWithSku.hasSku());
        assertTrue(resWithSku.hasProduct());

        ProductVisionPort.ProductVisionResult resWithoutSku = new ProductVisionPort.ProductVisionResult(null, "Lavabo metros", 456.0, "Lavabo");
        assertFalse(resWithoutSku.hasSku());
        assertTrue(resWithoutSku.hasProduct());
    }
}

