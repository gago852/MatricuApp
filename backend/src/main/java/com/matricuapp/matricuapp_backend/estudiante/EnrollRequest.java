package com.matricuapp.matricuapp_backend.estudiante;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record EnrollRequest(@NotEmpty List<Long> cursoIds) {}
