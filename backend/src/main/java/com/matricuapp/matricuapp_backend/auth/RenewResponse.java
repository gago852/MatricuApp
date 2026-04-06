package com.matricuapp.matricuapp_backend.auth;

public record RenewResponse(
    String token,
    Long id,
    String nombre,
    String carrera,
    int semestre,
    boolean matriculado
) {}
