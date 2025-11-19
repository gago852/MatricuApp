import {
  onAddCursosMatriculados,
  setCreditosPermitidosUsuario,
  setCursos,
} from "@/store/dashboard/dashboardSlice";
import type { AppDispatch } from "@/store/store";
import {
  CursoSchemaArray,
  EstudianteAuthSchemaArray,
  EstudianteSchema,
  EstudianteSchemaArray,
} from "@/types/schemas";

export const loadCursos = (dispatch: AppDispatch) => {
  const cursos = localStorage.getItem("cursos");

  if (cursos !== null) {
    const result = CursoSchemaArray.safeParse(JSON.parse(cursos));
    if (result.data) {
      dispatch(setCursos(result.data));
    }
  } else {
    dispatch(setCursos([]));
  }
};

export const loadEstudiante = (dispatch: AppDispatch, userId: number) => {
  const result = EstudianteSchemaArray.safeParse(
    JSON.parse(localStorage.getItem("estudiantes") || "[]")
  );

  if (result.error) return;

  const estudiante = result.data.find((estudiante) => estudiante.id === userId);

  if (!estudiante) return;

  dispatch(setCreditosPermitidosUsuario(estudiante.creditosPermitidos));
  const cursos = localStorage.getItem("cursos");

  if (!cursos) return;

  const cursosMatriculados = CursoSchemaArray.safeParse(
    JSON.parse(cursos)
  ).data?.filter((curso) => estudiante.cursosMatriculados.includes(curso.id));

  if (!cursosMatriculados) return;

  dispatch(onAddCursosMatriculados(cursosMatriculados));
};
