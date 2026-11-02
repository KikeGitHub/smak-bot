package com.smakbot.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SmakbotCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmakbotCoreApplication.class, args);
    }
}
