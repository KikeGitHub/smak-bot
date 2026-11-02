package com.smakbot.core.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${smakbot.cors.admin-origins:http://localhost:4200,http://localhost:8000,http://127.0.0.1:8000}")
    private String adminOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 1. Widget Web: Permite consumo desde cualquier sitio web de clientes (SWAP)
        registry.addMapping("/api/v1/chat/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("X-Session-ID", "X-Tenant-ID")
                .allowCredentials(false)
                .maxAge(3600);

        // 2. Webhooks Meta Cloud API
        registry.addMapping("/api/v1/whatsapp/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*");

        // 3. Panel Administrativo SaaS
        registry.addMapping("/api/v1/admin/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}
