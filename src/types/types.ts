export interface Curso {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  semestre: number;
  limiteCupos: number;
  matriculados: number;
}

export interface Estudiante {
  id: number;
  nombre: string;
  carrera: string;
  semestre: number;
  matriculado: boolean;
  creditosMatriculados: number;
  creditosPermitidos: number;
  cursosMatriculados: number[];
}

export type ViewMode = "list" | "calendar";
