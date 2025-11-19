import { Button } from "@/components/ui/button";
import type { Curso } from "@/types/types";

interface Props {
  course: Curso;
}

export const CursoCard = ({ course }: Props) => {
  const availableSpots = course.limiteCupos - course.matriculados;

  const handleRemoveCourse = () => {
    console.log("Remove course");
  };
  return (
    <div className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
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
          onClick={handleRemoveCourse}
          className="text-destructive hover:bg-destructive/10"
        >
          Quitar
        </Button>
      </div>
    </div>
  );
};
