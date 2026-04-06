package com.matricuapp.matricuapp_backend.estudiante;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    private final EstudianteService estudianteService;

    public EstudianteController(EstudianteService estudianteService) {
        this.estudianteService = estudianteService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.findById(id));
    }

    @PostMapping("/{id}/matricula")
    public ResponseEntity<EstudianteResponse> addMatricula(
            @PathVariable Long id,
            @Valid @RequestBody EnrollRequest request) {
        return ResponseEntity.ok(estudianteService.addMatricula(id, request));
    }

    @DeleteMapping("/{id}/matricula/{cursoId}")
    public ResponseEntity<EstudianteResponse> removeMatricula(
            @PathVariable Long id,
            @PathVariable Long cursoId) {
        return ResponseEntity.ok(estudianteService.removeMatricula(id, cursoId));
    }
}
