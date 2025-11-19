import type { Estudiante } from "@/types/types";

export const usuariosMock: Estudiante[] = [
  {
    id: 101,
    nombre: "Juan Pérez",
    carrera: "Ingeniería de Sistemas",
    semestre: 2,
    matriculado: true,
    creditosPermitidos: 20,
    creditosMatriculados: 0,
    cursosMatriculados: [],
  },
];
