import { Input } from "@/components/ui/input";
import type { ComponentProps } from "react";

interface CursoSearchInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export const CursoSearchInput = ({
  value,
  onChange,
  placeholder = "Buscar cursos...",
  className,
  ...props
}: CursoSearchInputProps) => {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`text-sm ${className ?? ""}`.trim()}
      {...props}
    />
  );
};
