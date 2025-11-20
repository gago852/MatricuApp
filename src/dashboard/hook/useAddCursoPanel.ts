import { useCallback, useEffect, useMemo, useState } from "react";
import { useDashboardStore } from "@/hook/useDashboardStore";
import { useAuthStore } from "@/hook/useAuthStore";
import { useAppDispatch } from "@/hook/hooks";
import { closeCursoPanel } from "@/store/dashboard/addCursosSlice";
import { toast } from "sonner";
import type { Curso } from "@/types/types";

export const useAddCursoPanel = () => {
  const {
    cursos,
    creditosMatriculados,
    creditosPermitidos,
    cursosMatriculados: cursosMatriculadosIds,
    startAddCursosMatriculados,
  } = useDashboardStore();

  const initialSelectedCourseIds = useMemo(
    () => new Set(cursosMatriculadosIds),
    [cursosMatriculadosIds]
  );

  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const { semestre, matriculado } = user || { semestre: 0, matriculado: false };

  const [searchValue, setSearchValue] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Curso[]>([]);
  const [availableCredits, setAvailableCredits] = useState(creditosPermitidos);
  const [selectedCredits, setSelectedCredits] = useState(creditosMatriculados);
  const [filteredCourses, setFilteredCourses] = useState<Curso[]>(() =>
    cursos.filter((curso) => !initialSelectedCourseIds.has(curso.id))
  );
  const [confirmAddCourses, setConfirmAddCourses] = useState(false);

  const filterAvailableCourses = useCallback(
    (lista: Curso[]) =>
      lista.filter((curso) => !initialSelectedCourseIds.has(curso.id)),
    [initialSelectedCourseIds]
  );

  const cursosAnteriores = useMemo(() => {
    return filteredCourses.filter((curso) => curso.semestre === semestre - 1);
  }, [filteredCourses, semestre]);

  const cursosPrerequisitos = useMemo(() => {
    return cursosAnteriores.every((curso) => selectedCourses.includes(curso));
  }, [selectedCourses, cursosAnteriores]);

  const isCursoHabilitado = (curso: (typeof cursos)[0]) => {
    const yaSeleccionado = selectedCourses.includes(curso);

    if (yaSeleccionado) return true;

    if (curso.semestre === semestre - 1)
      return (
        selectedCredits + curso.creditos <= availableCredits &&
        curso.matriculados < curso.limiteCupos
      );

    if (curso.semestre >= semestre) {
      return (
        cursosPrerequisitos &&
        selectedCredits + curso.creditos <= availableCredits &&
        curso.matriculados < curso.limiteCupos
      );
    }

    return false;
  };

  const handleToggleCourse = (cursoFunction: Curso) => {
    if (selectedCourses.includes(cursoFunction)) {
      const cursosToRemove = selectedCourses.filter(
        (curso) => curso.semestre <= cursoFunction.semestre
      );
      const creditos = cursosToRemove.reduce(
        (total, curso) => total + curso.creditos,
        0
      );

      const creditosToRemove = cursoFunction.creditos;

      setSelectedCredits(creditos - creditosToRemove);
      setSelectedCourses(
        cursosToRemove.filter((curso) => curso.id !== cursoFunction.id)
      );
    } else {
      const creditos = cursoFunction.creditos;
      setSelectedCredits((prev) => prev + creditos);
      setSelectedCourses([...selectedCourses, cursoFunction]);
    }
  };

  const handleOnClosePanel = () => {
    dispatch(closeCursoPanel());
  };

  const confirmAddCoursesDialog = () => {
    setConfirmAddCourses(false);
    startAddCursosMatriculados(selectedCourses);
    handleOnClosePanel();
  };

  const handleCancelConfirmDialog = () => {
    setConfirmAddCourses(false);
  };

  const handleAddCourses = () => {
    if (!matriculado) {
      toast.error("No puedes agregar cursos si no estas matriculado");
      return;
    }

    if (selectedCourses.length === 0) {
      toast.error("No puedes agregar cursos si no seleccionas ninguno");
      return;
    }

    if (selectedCredits > availableCredits) {
      toast.error("No puedes agregar mas creditos de los permitidos");
      return;
    }

    setConfirmAddCourses(true);
  };

  const handleOnFilter = (semestreSeleccionado: number | null) => {
    setSemesterFilter(semestreSeleccionado);
    if (!semestreSeleccionado) {
      setFilteredCourses(filterAvailableCourses(cursos));
      return;
    }
    const filtrados = cursos.filter(
      (curso) => curso.semestre === semestreSeleccionado
    );
    setFilteredCourses(filterAvailableCourses(filtrados));
  };

  const handleClearFilters = () => {
    setSearchValue("");
    handleOnFilter(null);
  };

  const handleOnSearch = useCallback(
    (valorBusqueda: string) => {
      if (!valorBusqueda)
        return setFilteredCourses(filterAvailableCourses(cursos));

      setFilteredCourses(
        filterAvailableCourses(
          cursos.filter((curso) =>
            curso.nombre.toLowerCase().includes(valorBusqueda.toLowerCase())
          )
        )
      );
    },
    [cursos, filterAvailableCourses]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleOnSearch(searchValue);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue, handleOnSearch]);

  useEffect(() => {
    setFilteredCourses(filterAvailableCourses(cursos));
  }, [cursos, filterAvailableCourses]);

  useEffect(() => {
    setAvailableCredits(creditosPermitidos);
  }, [creditosPermitidos]);

  useEffect(() => {
    setSelectedCredits(creditosMatriculados);
    setSelectedCourses([]);
  }, [creditosMatriculados]);

  return {
    // Properties
    searchValue,
    semesterFilter,
    filteredCourses,
    selectedCourses,
    confirmAddCourses,
    availableCredits,
    selectedCredits,

    // Methods
    setSearchValue,
    handleOnFilter,
    handleClearFilters,
    handleToggleCourse,
    isCursoHabilitado,
    handleAddCourses,
    handleOnClosePanel,
    confirmAddCoursesDialog,
    handleCancelConfirmDialog,
  };
};
