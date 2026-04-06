package com.matricuapp.matricuapp_backend.estudiante;

import com.matricuapp.matricuapp_backend.curso.Curso;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "estudiante")
public class Estudiante {

    @Id
    private Long id;

    private String nombre;
    private String carrera;
    private int semestre;
    private boolean matriculado;
    private int creditosMatriculados;
    private int creditosPermitidos;
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "estudiante_curso",
        joinColumns = @JoinColumn(name = "estudiante_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursosMatriculados = new HashSet<>();

    protected Estudiante() {}

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCarrera() { return carrera; }
    public int getSemestre() { return semestre; }
    public boolean isMatriculado() { return matriculado; }
    public int getCreditosMatriculados() { return creditosMatriculados; }
    public int getCreditosPermitidos() { return creditosPermitidos; }
    public String getPassword() { return password; }
    public Set<Curso> getCursosMatriculados() { return cursosMatriculados; }

    public void setCreditosMatriculados(int creditosMatriculados) {
        this.creditosMatriculados = creditosMatriculados;
    }
}
