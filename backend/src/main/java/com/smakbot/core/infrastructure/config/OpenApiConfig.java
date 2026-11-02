package com.smakbot.core.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smakbotOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SMAKBOT Core Platform API")
                        .version("1.0.0")
                        .description("Motor de ventas multitenant omnicanal para WhatsApp Cloud API y Widgets Web interactivos en Honduras.")
                        .contact(new Contact()
                                .name("SyborX Engineering")
                                .email("soporte@syborx.com"))
                        .license(new License().name("Proprietary - SyborX SDOP Framework")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Servidor Local / Desarrollo"),
                        new Server().url("https://api.smakbot.com").description("Producción")
                ));
    }
}
