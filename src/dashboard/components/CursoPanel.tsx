import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { CursoCard } from "./CursoCard";
import { memo, useMemo, useState } from "react";
import { useDashboardStore } from "@/hook/useDashboardStore";
import { useAppDispatch } from "@/hook/hooks";
import { openCursoPanel } from "@/store/dashboard/addCursosSlice";

// type ViewMode = "list" | "calendar";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const CursoPanel = memo(() => {
  const {
    cursosMatriculados: cursosMatriculadosIds,
    creditosMatriculados,
    creditosPermitidos,
    cursos,
  } = useDashboardStore();
  const dispatch = useAppDispatch();
  // const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchValue, setSearchValue] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const cursosMatriculados = cursos.filter((curso) =>
    cursosMatriculadosIds.includes(curso.id)
  );
  const filteredCourses = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return cursosMatriculados.filter((curso) => {
      const matchSemester =
        semesterFilter === null || curso.semestre === semesterFilter;
      const matchQuery =
        query.length === 0 ||
        curso.nombre.toLowerCase().includes(query) ||
        curso.codigo.toLowerCase().includes(query);

      return matchSemester && matchQuery;
    });
  }, [cursosMatriculados, semesterFilter, searchValue]);

  // const handleCalendarClick = () => {
  //   // onViewModeChange('calendar')
  //   toast.info("Calendar view is under development. Coming soon!");
  // };

  const handleOpenCoursesClick = () => {
    dispatch(openCursoPanel());
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Credit indicator */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Créditos</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-primary">
                {creditosMatriculados}
              </span>
              <span className="text-sm text-muted-foreground">
                / {creditosPermitidos} máximo
              </span>
            </div>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${
                  (creditosMatriculados / creditosPermitidos) * 282.7
                } 282.7`}
                className="text-accent-foreground transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Enrolled courses section */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Cursos matriculados
          {cursosMatriculados.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({cursosMatriculados.length})
            </span>
          )}
        </h2>

        {/* Controls */}
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre o codigo..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {semesterFilter !== null
                    ? `Sem. ${semesterFilter}`
                    : "Semestre"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

          <div className="flex gap-2">
            {/* <div className="flex gap-1 border border-input rounded-md p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={handleCalendarClick}
                className="h-8 w-8 p-0"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div> */}
            <Button
              onClick={handleOpenCoursesClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar cursos
            </Button>
          </div>
        </div>
      </div>

      {/* Courses list */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {cursosMatriculados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-foreground font-medium mb-1">
              No hay cursos matriculados
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Click "Agregar cursos" para buscar cursos disponibles
            </p>
            <Button
              onClick={handleOpenCoursesClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Agregar cursos
            </Button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-foreground font-medium mb-1">
              No encontramos coincidencias
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Ajusta el buscador o el semestre para ver otros cursos
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchValue("");
                setSemesterFilter(null);
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCourses.map((course) => (
              <CursoCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
