import {
  onAddCursosMatriculados,
  onRemoveCursoMatriculados,
  onSetErrorMessage,
  setIsLoading,
} from "@/store/dashboard/dashboardSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadCursos, loadEstudiante } from "@/helpers/loadDashboard";
import type { Curso, Estudiante } from "@/types/types";
import { EstudianteSchemaArray } from "@/types/schemas";

export const useDashboardStore = () => {
  const {
    cursosMatriculados,
    creditosMatriculados,
    creditosPermitidos,
    cursos,
  } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const loadDashBoard = async () => {
    dispatch(setIsLoading(true));
    try {
      if (!user) return;
      loadCursos(dispatch);

      loadEstudiante(dispatch, user.id);
    } catch (error) {
      console.error("Error loading cursos:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const startAddCursosMatriculados = async (cursosAdd: Curso[]) => {
    if (!user || cursosAdd.length === 0) return;
    dispatch(setIsLoading(true));

    const cursosMatriculadosSet = new Set(cursosMatriculados);
    const cursosNuevos: Curso[] = [];
    cursosAdd.forEach((curso) => {
      if (cursosMatriculadosSet.has(curso.id)) return;
      cursosMatriculadosSet.add(curso.id);
      cursosNuevos.push(curso);
    });

    if (cursosNuevos.length === 0) {
      dispatch(setIsLoading(false));
      return;
    }

    dispatch(onAddCursosMatriculados(cursosNuevos));

    const creditosNuevos = cursosNuevos.reduce(
      (total, curso) => total + curso.creditos,
      0
    );

    const estudiantesBack = localStorage.getItem("estudiantes");

    if (!estudiantesBack) {
      dispatch(onSetErrorMessage("Error al agregar cursos"));
      dispatch(setIsLoading(false));
      return;
    }

    const result = EstudianteSchemaArray.safeParse(JSON.parse(estudiantesBack));

    if (result.data) {
      const estudiantes = result.data;
      const estudiante = estudiantes.find(
        (estudiante) => estudiante.id === user.id
      );
      if (estudiante) {
        const cursosPersistidosSet = new Set(estudiante.cursosMatriculados);
        cursosNuevos.forEach((curso) => {
          cursosPersistidosSet.add(curso.id);
        });
        const nuevoEstudiante: Estudiante = {
          ...estudiante,
          creditosMatriculados:
            (estudiante.creditosMatriculados ?? 0) + creditosNuevos,
          cursosMatriculados: Array.from(cursosPersistidosSet),
        };
        const nuevosEstudiantes = estudiantes.map((estudiante) => {
          if (estudiante.id === user.id) {
            return nuevoEstudiante;
          }
          return estudiante;
        });
        localStorage.setItem("estudiantes", JSON.stringify(nuevosEstudiantes));
      }
    }

    const nuevoCursos = cursos.map((curso) => {
      if (
        cursosNuevos.some(
          (cursoMatriculado) => cursoMatriculado.id === curso.id
        )
      ) {
        return {
          ...curso,
          matriculados: curso.matriculados + 1,
        };
      }
      return {
        ...curso,
      };
    });

    localStorage.setItem("cursos", JSON.stringify(nuevoCursos));

    dispatch(setIsLoading(false));
  };

  const startRemoveCursosMatriculados = async (curso: Curso) => {
    if (!user) return;
    dispatch(setIsLoading(true));
    const nuevoDesmatriculado = {
      ...curso,
      matriculados: curso.matriculados - 1,
    };
    dispatch(onRemoveCursoMatriculados(nuevoDesmatriculado));

    // TODO: Quitar curso de la base de datos
    const nuevaListaIds = cursosMatriculados.filter(
      (cursoNew) => cursoNew !== curso.id
    );

    const nuevoCreditosMatriculados = creditosMatriculados - curso.creditos;

    const estudiantesBack = localStorage.getItem("estudiantes");

    if (!estudiantesBack) {
      dispatch(onSetErrorMessage("Error al agregar cursos"));
      dispatch(setIsLoading(false));
      return;
    }

    const result = EstudianteSchemaArray.safeParse(JSON.parse(estudiantesBack));

    if (result.data) {
      const estudiantes = result.data;
      const estudiante = estudiantes.find(
        (estudiante) => estudiante.id === user.id
      );
      if (estudiante) {
        const nuevoEstudiante: Estudiante = {
          ...estudiante,
          creditosMatriculados: nuevoCreditosMatriculados,
          cursosMatriculados: nuevaListaIds,
        };
        const nuevosEstudiantes = estudiantes.map((estudiante) => {
          if (estudiante.id === user.id) {
            return nuevoEstudiante;
          }
          return estudiante;
        });
        localStorage.setItem("estudiantes", JSON.stringify(nuevosEstudiantes));
      }
    }

    const nuevoCursos = cursos.map((curso) => {
      if (
        cursos.some(
          (cursoMatriculado) => cursoMatriculado.id === nuevoDesmatriculado.id
        )
      ) {
        return {
          ...curso,
          matriculados: curso.matriculados - 1,
        };
      }
      return {
        ...curso,
      };
    });

    localStorage.setItem("cursos", JSON.stringify(nuevoCursos));

    dispatch(setIsLoading(false));
  };

  return {
    // Properties
    cursosMatriculados,
    creditosMatriculados,
    creditosPermitidos,
    cursos,
    // Methods
    startAddCursosMatriculados,
    loadDashBoard,
    startRemoveCursosMatriculados,
  };
};
