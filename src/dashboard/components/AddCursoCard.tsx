import type { Curso } from "@/types/types";
import { useState } from "react";

interface Props {
  curso: Curso;
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}
export const AddCursoCard = ({ curso, selected, onToggle, disabled }: Props) => {
  const [availableSpots, setAvailableSpots] = useState(
    curso.limiteCupos - curso.matriculados
  );


  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`w-full p-3 rounded-lg border transition-all text-left ${
        selected
          ? "border-accent bg-accent/10"
          : "border-border bg-card hover:border-primary/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 ${
            selected ? "bg-accent border-accent" : "border-border bg-card"
          }`}
        >
          {selected && (
            <span className="text-accent-foreground text-xs">✓</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm text-foreground truncate">
              {curso.nombre}
            </h4>
            <span className="text-xs font-semibold text-accent flex-shrink-0">
              {curso.creditos}cr
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {curso.codigo} • {availableSpots}/{curso.limiteCupos} spots
          </p>
        </div>
      </div>
    </button>
  );
};
