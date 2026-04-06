import * as z from "zod/v4";

export const CursoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  codigo: z.string(),
  creditos: z.number(),
  semestre: z.number(),
  limiteCupos: z.number(),
  matriculados: z.number(),
});

export const CursoSchemaArray = z.array(CursoSchema);

export const EstudianteAuthSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  carrera: z.string(),
  semestre: z.number(),
  matriculado: z.boolean(),
});
export const EstudianteSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  carrera: z.string(),
  semestre: z.number(),
  matriculado: z.boolean(),
  creditosMatriculados: z.number(),
  creditosPermitidos: z.number(),
  cursosMatriculados: z.array(z.number()),
});

export const EstudianteAuthSchemaArray = z.array(EstudianteAuthSchema);

export const EstudianteSchemaArray = z.array(EstudianteSchema);
