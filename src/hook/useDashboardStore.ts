import { setIsLoading } from "@/store/dashboard/dashboardSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadCursos, loadEstudiante } from "@/helpers/loadDashboard";

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

  const startAddCursosMatriculados = async (cursos: Curso[]) => {
    // dispatch(onAddCursosMatriculados(cursos));
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
  };
};
