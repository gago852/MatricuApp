import { useAuthStore } from "@/hook/useAuthStore";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAppSelector } from "@/hook/hooks";

export const Header = () => {
  const { user: student, startLogout } = useAuthStore();
  const { creditosPermitidos } = useAppSelector((state) => state.dashboard);

  const handleLogout = () => {
    startLogout();
  };
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            <img src="favicon.png" width="24" />
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">
            Matricula
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 h-10 px-3"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {student?.nombre}
                </span>
                <span className="text-xs text-muted-foreground">
                  {student?.carrera}
                </span>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-accent-foreground">
                {student?.nombre.charAt(0)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Perfil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-2 text-sm space-y-1">
              <p className="text-foreground font-medium">{student?.nombre}</p>
              <p className="text-muted-foreground">ID: {student?.id}</p>
              <p className="text-muted-foreground">{student?.carrera}</p>
              <p className="text-muted-foreground">
                Semestre: {student?.semestre}
              </p>
              <p className="text-muted-foreground">
                Créditos: {creditosPermitidos}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <span className="text-destructive">Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
