package com.matricuapp.matricuapp_backend.estudiante;

import java.util.List;

public record EstudianteResponse(
    Long id,
    String nombre,
    String carrera,
    int semestre,
    boolean matriculado,
    int creditosMatriculados,
    int creditosPermitidos,
    List<Long> cursosMatriculados
) {
    public static EstudianteResponse from(Estudiante estudiante) {
        List<Long> ids = estudiante.getCursosMatriculados().stream()
            .map(c -> c.getId())
            .toList();
        return new EstudianteResponse(
            estudiante.getId(), estudiante.getNombre(), estudiante.getCarrera(),
            estudiante.getSemestre(), estudiante.isMatriculado(),
            estudiante.getCreditosMatriculados(), estudiante.getCreditosPermitidos(),
            ids
        );
    }
}
