package com.matricuapp.matricuapp_backend.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(@NotNull Long id, @NotBlank String password) {}
