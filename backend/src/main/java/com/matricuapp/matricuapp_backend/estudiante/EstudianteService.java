package com.matricuapp.matricuapp_backend.estudiante;

import com.matricuapp.matricuapp_backend.curso.Curso;
import com.matricuapp.matricuapp_backend.curso.CursoRepository;
import com.matricuapp.matricuapp_backend.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstudianteService {

    private static final Logger log = LoggerFactory.getLogger(EstudianteService.class);

    private final EstudianteRepository estudianteRepository;
    private final CursoRepository cursoRepository;

    public EstudianteService(EstudianteRepository estudianteRepository,
                             CursoRepository cursoRepository) {
        this.estudianteRepository = estudianteRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional(readOnly = true)
    public EstudianteResponse findById(Long id) {
        return estudianteRepository.findById(id)
            .map(EstudianteResponse::from)
            .orElseThrow(() -> new BusinessException("Estudiante no encontrado"));
    }

    @Transactional
    public EstudianteResponse addMatricula(Long estudianteId, EnrollRequest request) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
            .orElseThrow(() -> new BusinessException("Estudiante no encontrado"));

        if (!estudiante.isMatriculado()) {
            throw new BusinessException("El estudiante no está activo en el período académico");
        }

        for (Long cursoId : request.cursoIds()) {
            Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new BusinessException("Curso no encontrado: " + cursoId));

            if (curso.getSemestre() != estudiante.getSemestre()) {
                throw new BusinessException("El curso " + curso.getCodigo() + " no corresponde al semestre del estudiante");
            }
            if (curso.getMatriculados() >= curso.getLimiteCupos()) {
                throw new BusinessException("El curso " + curso.getCodigo() + " no tiene cupos disponibles");
            }
            if (estudiante.getCursosMatriculados().contains(curso)) {
                throw new BusinessException("Ya está matriculado en: " + curso.getCodigo());
            }

            int creditosFuturos = estudiante.getCreditosMatriculados() + curso.getCreditos();
            if (creditosFuturos > estudiante.getCreditosPermitidos()) {
                throw new BusinessException("Agregar " + curso.getCodigo() + " excede el límite de créditos permitidos");
            }

            estudiante.getCursosMatriculados().add(curso);
            estudiante.setCreditosMatriculados(creditosFuturos);
            curso.setMatriculados(curso.getMatriculados() + 1);
        }

        log.info("add_matricula estudiante_id={} cursos={}", estudianteId, request.cursoIds());
        return EstudianteResponse.from(estudianteRepository.save(estudiante));
    }

    @Transactional
    public EstudianteResponse removeMatricula(Long estudianteId, Long cursoId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
            .orElseThrow(() -> new BusinessException("Estudiante no encontrado"));

        Curso curso = cursoRepository.findById(cursoId)
            .orElseThrow(() -> new BusinessException("Curso no encontrado: " + cursoId));

        if (!estudiante.getCursosMatriculados().contains(curso)) {
            throw new BusinessException("El estudiante no está matriculado en: " + curso.getCodigo());
        }

        estudiante.getCursosMatriculados().remove(curso);
        estudiante.setCreditosMatriculados(
            Math.max(0, estudiante.getCreditosMatriculados() - curso.getCreditos())
        );
        curso.setMatriculados(Math.max(0, curso.getMatriculados() - 1));

        log.info("remove_matricula estudiante_id={} curso_id={}", estudianteId, cursoId);
        return EstudianteResponse.from(estudianteRepository.save(estudiante));
    }
}
