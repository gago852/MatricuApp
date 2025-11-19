import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hook/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const LoginPage = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const { errorMessage, startLogin } = useAuthStore();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startLogin(Number(studentId), password);
  };

  useEffect(() => {
    if (!errorMessage) return;

    toast.error(errorMessage);
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
            {/* <span className="text-primary-foreground font-bold text-xl"> */}
            <img src="favicon.png" alt="Logo" className="max-h-[60%]" />
            {/* </span> */}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Matriculación Académica
          </h1>
          <p className="text-muted-foreground">
            Iniciar sesión para gestionar tu inscripción a cursos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-foreground mb-2"
            >
              ID de Estudiante
            </label>
            <Input
              id="studentId"
              type="text"
              placeholder="Ingrese su ID de estudiante"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full"
            />
          </div>

          {/* {errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {errorMessage}
            </div>
          )} */}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Credenciales de demostración:</span>{" "}
            ID de Estudiante: <span className="font-mono">101</span>
            <br />
            Contraseña: <span className="font-mono">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
};
