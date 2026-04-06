import { Button } from "@/components/ui/button";
import { AddCursoCard } from "./AddCursoCard";
import { CursoSearchInput } from "./cursoSearchInput";
import { CursoSemesterFilter } from "./CursoSemesterFilter";
import { useAddCursoPanel } from "@/dashboard/hook/useAddCursoPanel";

export const AddCursoPanel = () => {
  const {
    searchValue,
    setSearchValue,
    semesterFilter,
    handleOnFilter,
    handleClearFilters,
    filteredCourses,
    selectedCourses,
    handleToggleCourse,
    isCursoHabilitado,
    handleAddCourses,
    confirmAddCourses,
    handleOnClosePanel,
    confirmAddCoursesDialog,
    handleCancelConfirmDialog,
    // availableCredits,
    selectedCredits,
    creditosPermitidos,
  } = useAddCursoPanel();

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
                  {creditosPermitidos}
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
