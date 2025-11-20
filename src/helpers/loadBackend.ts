import { cursosMock } from "@/mock/cursos.mock";
import { usuariosMock } from "@/mock/usuario.mock";

export const loadBackend = () => {
  if (!localStorage.getItem("cursos")) {
    localStorage.setItem("cursos", JSON.stringify(cursosMock));
  }
  if (!localStorage.getItem("estudiantes")) {
    localStorage.setItem("estudiantes", JSON.stringify(usuariosMock));
  }
};
