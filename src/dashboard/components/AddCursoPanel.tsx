import { Button } from "@/components/ui/button";
import { AddCursoCard } from "./AddCursoCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import type { Curso } from "@/types/types";
import { useDashboardStore } from "@/hook/useDashboardStore";
import { useAuthStore } from "@/hook/useAuthStore";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const AddCursoPanel = () => {
  const { cursos, creditosMatriculados, creditosPermitidos } =
    useDashboardStore();
  const { user } = useAuthStore();
  const { semestre, matriculado } = user || { semestre: 0, matriculado: false };
  const [searchValue, setSearchValue] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Curso[]>([]);
  const [availableCredits, setAvailableCredits] = useState(creditosPermitidos);
  const [selectedCredits, setSelectedCredits] = useState(creditosMatriculados);
  const [filteredCourses, setFilteredCourses] = useState<Curso[]>(cursos);

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
      return selectedCredits + curso.creditos <= availableCredits;

    // Cursos de semestres superiores solo si prerequisitos completos
    if (curso.semestre >= semestre) {
      return (
        cursosPrerequisitos &&
        selectedCredits + curso.creditos <= availableCredits
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
    console.log("Close panel");
  };

  const handleAddCourses = () => {
    console.log("Add courses");
  };

  useEffect(() => {
    setFilteredCourses(cursos);
  }, [cursos]);
  useEffect(() => {
    setAvailableCredits(creditosPermitidos);
  }, [creditosPermitidos]);
  useEffect(() => {
    setSelectedCredits(creditosMatriculados);
  }, [creditosMatriculados]);

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col overflow-hidden">
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
        <Input
          placeholder="Buscar cursos..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="text-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {semesterFilter
                ? `Semestre ${semesterFilter}`
                : "Todos los semestres"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setSemesterFilter(null)}>
              Todos los semestres
            </DropdownMenuItem>
            {SEMESTERS.map((sem) => (
              <DropdownMenuItem
                key={sem}
                onClick={() => setSemesterFilter(sem)}
              >
                Semestre {sem}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
  );
};
