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
    if (!user) return;
    dispatch(setIsLoading(true));

    dispatch(onAddCursosMatriculados(cursosAdd));

    // TODO: Agregar cursos a la base de datos
    const creditosMatriculados = cursosAdd.reduce(
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
        const cursosMatriculadosIds = cursosAdd.map((curso) => curso.id);
        const nuevoEstudiante: Estudiante = {
          ...estudiante,
          creditosMatriculados,
          cursosMatriculados: cursosMatriculadosIds,
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
        cursosAdd.some((cursoMatriculado) => cursoMatriculado.id === curso.id)
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
