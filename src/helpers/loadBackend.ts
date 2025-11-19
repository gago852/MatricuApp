import { cursosMock } from "@/mock/cursos.mock";
import { usuariosMock } from "@/mock/usuario.mock";

export const loadBackend = () => {
  localStorage.setItem("cursos", JSON.stringify(cursosMock));
  localStorage.setItem("estudiantes", JSON.stringify(usuariosMock));
};
