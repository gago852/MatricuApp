package com.matricuapp.matricuapp_backend.auth;

import com.matricuapp.matricuapp_backend.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(AppProperties appProperties) {
        this.signingKey = Keys.hmacShaKeyFor(
            appProperties.jwt().secret().getBytes(StandardCharsets.UTF_8)
        );
        this.expirationMs = appProperties.jwt().expiration() * 1000L;
    }

    public String generateToken(Long userId) {
        Date now = new Date();
        return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(now)
            .expiration(new Date(now.getTime() + expirationMs))
            .signWith(signingKey)
            .compact();
    }

    public Optional<Long> extractUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return Optional.of(Long.parseLong(claims.getSubject()));
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("jwt_invalid token={}", token.substring(0, Math.min(token.length(), 10)));
            return Optional.empty();
        }
    }
}
