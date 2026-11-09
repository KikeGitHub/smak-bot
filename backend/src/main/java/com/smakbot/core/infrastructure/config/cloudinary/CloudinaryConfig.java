package com.smakbot.core.infrastructure.config.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${smakbot.cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${smakbot.cloudinary.api-key:}")
    private String apiKey;

    @Value("${smakbot.cloudinary.api-secret:}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudName != null && !cloudName.isBlank()
                && apiKey != null && !apiKey.isBlank()
                && apiSecret != null && !apiSecret.isBlank()) {
            log.info("Inicializando cliente Cloudinary para cloud_name: {}", cloudName);
            Map<String, Object> config = ObjectUtils.asMap(
                    "cloud_name", cloudName.trim(),
                    "api_key", apiKey.trim(),
                    "api_secret", apiSecret.trim(),
                    "secure", true
            );
            return new Cloudinary(config);
        }
        log.warn("Credenciales de Cloudinary no configuradas (CLOUDINARY_CLOUD_NAME / API_KEY / SECRET vacíos). Se activará almacenamiento local de contingencia.");
        return null;
    }
}

