package com.matricuapp.matricuapp_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(String allowedOrigins, Jwt jwt) {

    public record Jwt(String secret, long expiration) {}
}
