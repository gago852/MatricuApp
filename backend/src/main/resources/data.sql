INSERT INTO curso (id, nombre, codigo, creditos, semestre, limite_cupos, matriculados) VALUES
  (1, 'Matemáticas Aplicadas', 'MAT101', 3, 2, 30, 25),
  (2, 'Programación en React', 'PRG201', 4, 2, 20, 18),
  (3, 'Física Básica', 'FIS102', 4, 2, 40, 30),
  (4, 'Bases de Datos', 'BD202', 3, 2, 25, 17),
  (5, 'Álgebra Lineal', 'ALG103', 4, 2, 50, 35),
  (6, 'Diseño de Interfaces', 'UX203', 3, 2, 15, 10)
ON CONFLICT (id) DO NOTHING;

-- password: 123456 (BCrypt hash)
INSERT INTO estudiante (id, nombre, carrera, semestre, matriculado, creditos_matriculados, creditos_permitidos, password) VALUES
  (101, 'Juan Pérez', 'Ingeniería de Sistemas', 2, true, 0, 20, '$2b$10$p9r4hSpz40xGk66y1vJuPebtXqSbYd2OxE3ZnhXVP6aWj5OQD2eQy')
ON CONFLICT (id) DO NOTHING;
