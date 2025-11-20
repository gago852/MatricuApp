# MatricuApp

Aplicación de matriculación académica construida con **React + TypeScript + Vite**, que simula el flujo de inscripción de cursos de un estudiante para un semestre académico.

El objetivo principal es cubrir los requerimientos funcionales de la prueba técnica y, al mismo tiempo, mostrar buenas prácticas en organización de código, manejo de estado global y validación de reglas de negocio.

## 🚀 Instrucciones para ejecutar la aplicación

### Requisitos previos

- Node.js 18+ instalado.
- pnpm instalado (el proyecto usa `pnpm-lock.yaml`).

```bash
npm install -g pnpm
```

### Instalación de dependencias

```bash
pnpm install
```

### Ejecutar en modo desarrollo

```bash
pnpm dev
```

La aplicación quedará disponible (por defecto) en:

- `http://localhost:5173`

### Build para producción

```bash
pnpm build
```

### Previsualizar build de producción

```bash
pnpm preview
```

---

## ✅ Cobertura de requerimientos funcionales

A continuación se detalla cómo se implementó cada requerimiento de la prueba:

### 1. Inicio de sesión (opcional)

- El login se implementa en `src/auth/LoginPage.tsx` y se orquesta con el hook `useAuthStore` (`src/hook/useAuthStore.ts`).
- El usuario ingresa:
  - `ID de estudiante` (numérico).
  - `Contraseña` (fija para la prueba: `123456`).
- Los datos de estudiantes se leen desde `localStorage` (llave `estudiantes`) y se validan con esquemas de Zod (`EstudianteAuthSchemaArray`).
- El estado de autenticación se maneja con Redux Toolkit en `authSlice` (`src/store/auth/authSlice.ts`), incluyendo los estados `checking | authenticated | not-authenticated`.
- Se persiste el `userId` en `localStorage` para mantener la sesión (ver `checkAuthSession` en `useAuthStore`).

### 2. Listado de cursos disponibles

- Los cursos se definen y validan con el tipo `Curso` (`src/types/types.ts`) y los esquemas Zod (`CursoSchemaArray`).
- Se cargan desde `localStorage` (llave `cursos`) en el helper `loadCursos` (`src/helpers/loadDashboard.ts`).
- El estado global de cursos vive en `dashboardSlice` (`src/store/dashboard/dashboardSlice.ts`).
- En la UI, el listado principal se muestra en el panel de cursos (`CursoPanel` y componentes dentro de `src/dashboard/components/`).
- Cada curso incluye:
  - `nombre`, `codigo`, `creditos`, `semestre`.
  - `limiteCupos` y `matriculados` para validar disponibilidad de cupos.

### 3. Asignación de cursos

- La selección de cursos se realiza desde el panel lateral `AddCursoPanel` (`src/dashboard/components/AddCursoPanel.tsx`).
- La lógica de selección, filtros y validaciones de créditos vive en el hook `useAddCursoPanel` (`src/dashboard/hook/useAddCursoPanel.ts`).
- El usuario puede:
  - Buscar cursos por nombre.
  - Filtrar por semestre.
  - Seleccionar múltiples cursos antes de confirmar.
- Una vez confirmada la selección, se llama a `startAddCursosMatriculados` en `useDashboardStore` (`src/hook/useDashboardStore.ts`), que:
  - Actualiza el estado global (`dashboardSlice.onAddCursosMatriculados`).
  - Persiste la nueva matrícula del estudiante y los cursos en `localStorage`.

### 4. Validación de requisitos

Las reglas de negocio se centralizan principalmente en `useAddCursoPanel`, `useDashboardStore` y `dashboardSlice`:

- **Estudiante matriculado en el periodo académico**
  - El objeto `Estudiante` (`src/types/types.ts`) tiene la propiedad `matriculado`.
  - Antes de permitir la confirmación de cursos, `handleAddCourses` en `useAddCursoPanel` valida `matriculado`; si es `false` se muestra un error con `toast`.

- **Solo cursos del semestre actual**
  - Se usa la propiedad `semestre` del estudiante autenticado y de cada curso.
  - En `isCursoHabilitado` (`useAddCursoPanel`) se controla qué cursos pueden seleccionarse en función del semestre actual del estudiante y de potenciales prerequisitos.

- **No permitir cursos sin cupos disponibles**
  - Cada curso tiene `limiteCupos` y `matriculados`.
  - `isCursoHabilitado` verifica `curso.matriculados < curso.limiteCupos` antes de habilitar la selección.

- **Prevenir más créditos que el límite establecido**
  - `dashboardSlice` mantiene `creditosMatriculados` y `creditosPermitidos`.
  - `loadEstudiante` carga `creditosPermitidos` del estudiante autenticado y también hidrata los cursos ya matriculados.
  - En `useAddCursoPanel`:
    - `availableCredits` y `selectedCredits` se actualizan en tiempo real.
    - Antes de abrir el diálogo de confirmación, `handleAddCourses` valida que `selectedCredits <= availableCredits` y muestra un error en caso contrario.

### 5. Confirmación de matrícula y persistencia

- Al presionar "Agregar" en el panel lateral, se abre un **diálogo de confirmación** que resume:
  - Cantidad de cursos a matricular.
  - Total de créditos a agregar.
  - Listado de los cursos seleccionados.
- Si el usuario confirma:
  - Se ejecuta `confirmAddCoursesDialog` en `useAddCursoPanel`.
  - Se dispara `startAddCursosMatriculados` en `useDashboardStore`.
  - Se actualiza y persiste:
    - El estudiante (créditos y lista de `cursosMatriculados`).
    - La información de cursos (`matriculados`) en `localStorage`.

---

## 🧱 Decisiones de diseño y arquitectura

- **React + TypeScript + Vite**
  - Vite ofrece un entorno de desarrollo muy rápido y simple.
  - TypeScript ayuda a modelar correctamente entidades como `Curso` y `Estudiante` y reduce errores de negocio.

- **Redux Toolkit para estado global**
  - Se utiliza `@reduxjs/toolkit` para manejar estado de autenticación (`authSlice`), dashboard (`dashboardSlice`) y apertura del panel de cursos (`cursoPanelSlice`).
  - Facilita mantener una única fuente de la verdad para:
    - Usuario autenticado.
    - Cursos disponibles.
    - Matrículas y créditos.

- **Custom hooks como fachada sobre Redux**
  - `useAuthStore` y `useDashboardStore` encapsulan el acceso a Redux y exponen una API de dominio (por ejemplo `startLogin`, `loadDashBoard`, `startAddCursosMatriculados`).
  - Esto desacopla los componentes de la implementación concreta del store y mejora la testabilidad.

- **Validación con Zod**
  - Se utilizan esquemas (`CursoSchemaArray`, `EstudianteSchemaArray`, `EstudianteAuthSchemaArray`) para validar la forma de los datos que vienen del "backend" (simulado con `localStorage`).
  - Esto evita que datos corruptos rompan la aplicación y simplifica el manejo de errores.

- **LocalStorage como backend simulado**
  - Para alinearse con la prueba técnica, se usa `localStorage` como fuente de verdad de estudiantes y cursos.
  - Toda mutación relevante (matrículas, créditos, cupos) se persiste ahí para mantener el estado entre recargas.

- **División por responsabilidad**
  - `src/auth`: pantallas y lógica de autenticación.
  - `src/dashboard`: página principal y componentes del flujo de matrícula.
  - `src/store`: slices de Redux y configuración del store.
  - `src/hook`: hooks compartidos (`useAuthStore`, `useDashboardStore`, etc.).
  - `src/helpers`: funciones de carga/hidratación de datos desde `localStorage`.
  - `src/types` y `src/mock`: tipado fuerte y datos de ejemplo.

- **UI desacoplada de la lógica**
  - Componentes como `AddCursoPanel`, `CursoPanel` y tarjetas de curso se centran en la presentación.
  - La lógica de negocio vive en los hooks y slices, siguiendo un enfoque cercano a **container/presenter**.

---

## ⚠️ Limitaciones y aspectos no implementados

- **Backend real**
  - No hay integración con un servidor real ni base de datos. Todo se simula con `localStorage`.

- **Manejo avanzado de errores/red**
  - Se asume que la lectura/escritura en `localStorage` siempre está disponible.
  - No se implementan estrategias avanzadas de reintento ni reportes de error a un sistema externo.

- **Gestión de prerequisitos compleja**
  - Se incluye una lógica básica para que los cursos de semestres superiores requieran haber seleccionado los del semestre anterior, pero no se maneja un grafo complejo de prerequisitos.

- **Validaciones adicionales de negocio**
  - No se implementan reglas como horarios solapados, incompatibilidades entre cursos, etc., ya que no forman parte explícita del alcance de la prueba.

- **Accesibilidad y tests automatizados**
  - La UI está pensada para ser usable, pero no se ha hecho un trabajo exhaustivo de accesibilidad (ARIA, navegación por teclado, etc.).
  - No se incluyen tests automatizados por temas de tiempo, aunque la estructura del proyecto facilita añadir pruebas unitarias a hooks y slices.

---

## 📝 Notas finales

Este proyecto busca priorizar:

- Claridad en la separación de responsabilidades.
- Modelado explícito de las reglas de negocio de matrícula.
- Persistencia simple pero coherente del estado en `localStorage`.

Cualquier mejora adicional (nuevas reglas, endpoints reales, tests) puede construirse fácilmente sobre la arquitectura actual.
