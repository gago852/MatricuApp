package com.matricuapp.matricuapp_backend.auth;

public record LoginResponse(
    String token,
    Long id,
    String nombre,
    String carrera,
    int semestre,
    boolean matriculado
) {}
