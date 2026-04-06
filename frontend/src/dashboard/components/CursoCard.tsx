import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/hook/useDashboardStore";
import type { Curso } from "@/types/types";
import { useState } from "react";

interface Props {
  course: Curso;
}

export const CursoCard = ({ course }: Props) => {
  const { startRemoveCursosMatriculados } = useDashboardStore();
  const availableSpots = course.limiteCupos - course.matriculados;
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleRemoveCourse = () => {
    startRemoveCursosMatriculados(course);
    setConfirmRemove(false);
  };
  return (
    <div className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
              {course.codigo}
            </span>
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
              {course.creditos} creditos
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1 truncate">
            {course.nombre}
          </h3>
          <p className="text-sm text-muted-foreground">
            Semestre {course.semestre} • {availableSpots} cupos disponibles
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmRemove(true)}
          className="text-destructive hover:bg-destructive/10"
        >
          Quitar
        </Button>
      </div>

      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-foreground">
                ¿Quitar curso?
              </h4>
              <p className="text-sm text-muted-foreground">
                Se eliminará "{course.nombre}" de tus cursos matriculados. Esta
                acción no se puede deshacer.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setConfirmRemove(false)}
              >
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleRemoveCourse}
              >
                Quitar curso
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
