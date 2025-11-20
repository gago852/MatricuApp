import { Button } from "@/components/ui/button";
import { AddCursoCard } from "./AddCursoCard";
import { CursoSearchInput } from "./cursoSearchInput";
import { CursoSemesterFilter } from "./CursoSemesterFilter";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Curso } from "@/types/types";
import { useDashboardStore } from "@/hook/useDashboardStore";
import { useAuthStore } from "@/hook/useAuthStore";
import { useAppDispatch } from "@/hook/hooks";
import { closeCursoPanel } from "@/store/dashboard/addCursosSlice";
import { toast } from "sonner";

export const AddCursoPanel = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const cursosPrerequisitos = useMemo(() => {
    return cursosAnteriores.every((curso) => selectedCourses.includes(curso));
  }, [selectedCourses, cursosAnteriores]);

  const isCursoHabilitado = (curso: (typeof cursos)[0]) => {
    const yaSeleccionado = selectedCourses.includes(curso);

    // Si ya está seleccionado, siempre habilitado (para poder deseleccionar)
    if (yaSeleccionado) return true;

    // Cursos del semestre anterior siempre habilitados
    if (curso.semestre === semestre - 1)
      return (
        selectedCredits + curso.creditos <= availableCredits &&
        curso.matriculados < curso.limiteCupos
      );

    // Cursos de semestres superiores solo si prerequisitos completos
    if (curso.semestre >= semestre) {
      return (
        cursosPrerequisitos &&
        selectedCredits + curso.creditos <= availableCredits &&
        curso.matriculados < curso.limiteCupos
      );
    }

    // Cursos de semestres muy anteriores deshabilitados
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

  const handleOnFilter = (semestre: number | null) => {
    setSemesterFilter(semestre);
    if (!semestre) {
      setFilteredCourses(filterAvailableCourses(cursos));
      return;
    }
    const filtrados = cursos.filter((curso) => curso.semestre === semestre);
    setFilteredCourses(filterAvailableCourses(filtrados));
  };

  const handleClearFilters = () => {
    setSearchValue("");
    handleOnFilter(null);
  };

  const handleOnSearch = useCallback(
    (searchValue: string) => {
      if (!searchValue)
        return setFilteredCourses(filterAvailableCourses(cursos));

      setFilteredCourses(
        filterAvailableCourses(
          cursos.filter((curso) =>
            curso.nombre.toLowerCase().includes(searchValue.toLowerCase())
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

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-6"
        onClick={handleOnClosePanel}
      >
        <div
          className="w-full max-w-4xl max-h-[90vh] border border-border bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">
                Agregar Cursos
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOnClosePanel}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                Creditos disponibles:{" "}
                <span className="font-semibold text-foreground">
                  {availableCredits}
                </span>
              </p>
              <p className="text-muted-foreground">
                Creditos seleccionados:{" "}
                <span className="font-semibold text-accent-foreground">
                  {selectedCredits}
                </span>{" "}
                creditos
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 py-3 space-y-2 border-b border-border">
            <CursoSearchInput value={searchValue} onChange={setSearchValue} />
            <CursoSemesterFilter
              value={semesterFilter}
              onChange={handleOnFilter}
              buttonProps={{
                variant: "outline",
                size: "sm",
                className: "w-full",
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={handleClearFilters}
              disabled={!searchValue && semesterFilter === null}
            >
              Limpiar filtros
            </Button>
          </div>

          {/* Courses list */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-muted-foreground">
                  No hay cursos disponibles
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCourses.map((course) => {
                  const isDisabled = isCursoHabilitado(course);

                  return (
                    <AddCursoCard
                      key={course.id}
                      curso={course}
                      selected={selectedCourses.includes(course)}
                      onToggle={() => handleToggleCourse(course)}
                      disabled={!isDisabled}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border space-y-2">
            <Button
              onClick={handleAddCourses}
              disabled={selectedCourses.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              Agregar{" "}
              {selectedCourses.length > 0 ? `(${selectedCourses.length})` : ""}
            </Button>
            <Button
              variant="outline"
              onClick={handleOnClosePanel}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {confirmAddCourses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Confirmar matriculación
              </h3>
              <p className="text-sm text-muted-foreground">
                Vas a matricular {selectedCourses.length}{" "}
                {selectedCourses.length === 1 ? "curso" : "cursos"} con un total
                de {selectedCredits} créditos. ¿Deseas continuar?
              </p>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-md border border-border bg-muted/40 p-3 space-y-2 text-sm">
              {selectedCourses.map((curso) => (
                <div
                  key={curso.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="font-medium text-foreground">
                    {curso.nombre}
                  </span>
                  <span className="text-muted-foreground">
                    {curso.creditos} cr.
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleCancelConfirmDialog}
              >
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={confirmAddCoursesDialog}
              >
                Confirmar matriculación
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
