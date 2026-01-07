package com.studyapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/documents}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all paths to avoid preflight issues for resources
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get absolute path for uploads directory
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
        String uploadLocation = "file:" + uploadPath.toString().replace("\\", "/") + "/";

        System.out.println("=== Static Resource Configuration ===");
        System.out.println("Serving /uploads/** from: " + uploadLocation);

        // Serve uploaded files with proper absolute path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }
}
