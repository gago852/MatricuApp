package com.matricuapp.matricuapp_backend.curso;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;

    public CursoService(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    public List<CursoDto> findAll() {
        return cursoRepository.findAll().stream()
            .map(CursoDto::from)
            .toList();
    }
}
