import {
  onAddCursosMatriculados,
  onHydrateCursosMatriculados,
  onRemoveCursoMatriculados,
  onSetErrorMessage,
  setCreditosPermitidosUsuario,
  setCursos,
  setIsLoading,
} from "@/store/dashboard/dashboardSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { matricuApi } from "@/api/matricuApi";
import type { Curso } from "@/types/types";

export const useDashboardStore = () => {
  const { cursosMatriculados, creditosMatriculados, creditosPermitidos, cursos } =
    useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const loadDashBoard = async () => {
    if (!user) return;
    dispatch(setIsLoading(true));
    try {
      const [cursosData, estudianteData] = await Promise.all([
        matricuApi.getCursos(),
        matricuApi.getEstudiante(user.id),
      ]);

      dispatch(setCursos(cursosData));
      dispatch(setCreditosPermitidosUsuario(estudianteData.creditosPermitidos));

      const cursosMatriculadosData = cursosData.filter((c) =>
        estudianteData.cursosMatriculados.includes(c.id)
      );
      dispatch(onHydrateCursosMatriculados(cursosMatriculadosData));
    } catch (error) {
      console.error("Error loading dashboard:", error);
      dispatch(onSetErrorMessage("Error al cargar el dashboard"));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const startAddCursosMatriculados = async (cursosAdd: Curso[]) => {
    if (!user || cursosAdd.length === 0) return;
    dispatch(setIsLoading(true));
    try {
      const cursoIds = cursosAdd.map((c) => c.id);
      const estudianteActualizado = await matricuApi.addMatricula(user.id, cursoIds);

      // Actualizar cursos con los contadores actualizados del servidor
      const cursosActualizados = cursos.map((c) =>
        cursoIds.includes(c.id) ? { ...c, matriculados: c.matriculados + 1 } : c
      );
      dispatch(setCursos(cursosActualizados));
      dispatch(onAddCursosMatriculados(cursosAdd));

      dispatch(setCreditosPermitidosUsuario(estudianteActualizado.creditosPermitidos));
    } catch (error) {
      console.error("Error al matricular cursos:", error);
      dispatch(onSetErrorMessage("Error al agregar cursos"));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const startRemoveCursosMatriculados = async (curso: Curso) => {
    if (!user) return;
    dispatch(setIsLoading(true));
    try {
      await matricuApi.removeMatricula(user.id, curso.id);
      const cursoActualizado = { ...curso, matriculados: curso.matriculados - 1 };
      dispatch(onRemoveCursoMatriculados(cursoActualizado));
    } catch (error) {
      console.error("Error al desmatricular curso:", error);
      dispatch(onSetErrorMessage("Error al quitar el curso"));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return {
    cursosMatriculados,
    creditosMatriculados,
    creditosPermitidos,
    cursos,
    startAddCursosMatriculados,
    loadDashBoard,
    startRemoveCursosMatriculados,
  };
};
