package com.matricuapp.matricuapp_backend.curso;

public record CursoDto(
    Long id,
    String nombre,
    String codigo,
    int creditos,
    int semestre,
    int limiteCupos,
    int matriculados
) {
    public static CursoDto from(Curso curso) {
        return new CursoDto(curso.getId(), curso.getNombre(), curso.getCodigo(),
            curso.getCreditos(), curso.getSemestre(), curso.getLimiteCupos(),
            curso.getMatriculados());
    }
}
