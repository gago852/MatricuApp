import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ComponentProps } from "react";

const DEFAULT_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

type DropdownAlign = "start" | "center" | "end";

interface CursoSemesterFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
  semesters?: number[];
  placeholder?: string;
  allLabel?: string;
  renderValueLabel?: (value: number) => string;
  align?: DropdownAlign;
  buttonProps?: ComponentProps<typeof Button>;
  menuClassName?: string;
}

export const CursoSemesterFilter = ({
  value,
  onChange,
  semesters = DEFAULT_SEMESTERS,
  placeholder = "Todos los semestres",
  allLabel = "Todos los semestres",
  renderValueLabel = (sem) => `Semestre ${sem}`,
  align = "start",
  buttonProps,
  menuClassName,
}: CursoSemesterFilterProps) => {
  const triggerLabel = value === null ? placeholder : renderValueLabel(value);

  const menuClasses = ["w-48", menuClassName].filter(Boolean).join(" ");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...(buttonProps ?? {})}>{triggerLabel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={menuClasses}>
        <DropdownMenuItem onClick={() => onChange(null)}>
          {allLabel}
        </DropdownMenuItem>
        {semesters.map((sem) => (
          <DropdownMenuItem key={sem} onClick={() => onChange(sem)}>
            {renderValueLabel(sem)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
