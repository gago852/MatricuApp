package com.matricuapp.matricuapp_backend.auth;

import com.matricuapp.matricuapp_backend.estudiante.Estudiante;
import com.matricuapp.matricuapp_backend.estudiante.EstudianteRepository;
import com.matricuapp.matricuapp_backend.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final EstudianteRepository estudianteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(EstudianteRepository estudianteRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.estudianteRepository = estudianteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Estudiante estudiante = estudianteRepository.findById(request.id())
            .orElseThrow(() -> new BusinessException("Estudiante no encontrado"));

        if (!passwordEncoder.matches(request.password(), estudiante.getPassword())) {
            throw new BusinessException("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(estudiante.getId());
        log.info("login_success estudiante_id={}", estudiante.getId());

        return new LoginResponse(token, estudiante.getId(), estudiante.getNombre(),
            estudiante.getCarrera(), estudiante.getSemestre(), estudiante.isMatriculado());
    }

    public RenewResponse renew(Long userId) {
        Estudiante estudiante = estudianteRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("Estudiante no encontrado"));

        String token = jwtService.generateToken(estudiante.getId());
        log.info("token_renewed estudiante_id={}", userId);

        return new RenewResponse(token, estudiante.getId(), estudiante.getNombre(),
            estudiante.getCarrera(), estudiante.getSemestre(), estudiante.isMatriculado());
    }
}
