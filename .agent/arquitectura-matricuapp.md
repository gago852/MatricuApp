# Arquitectura de MatricuApp

Este documento describe en detalle la arquitectura interna de **MatricuApp**, las decisiones de diseño tomadas y los patrones aplicados para resolver la prueba técnica de matriculación académica.

---

## 1. Visión general

La aplicación se estructura siguiendo una aproximación por **capas de responsabilidad** dentro de un único frontend React:

- **Capa de Presentación (UI)**: componentes React (páginas, paneles, tarjetas) responsables de la experiencia de usuario.
- **Capa de Hooks de Dominio**: hooks personalizados que implementan la lógica de negocio y actúan como fachada sobre Redux y servicios.
- **Capa de Estado Global (Store)**: Redux Toolkit para centralizar el estado de autenticación y dashboard.
- **Capa de Acceso a Datos**: helpers y esquemas que leen/escriben en `localStorage`, simulando un backend.
- **Capa de Modelo de Dominio**: tipos TypeScript y esquemas Zod que definen entidades como `Curso` y `Estudiante`.

El objetivo es mantener una separación clara entre **UI** y **reglas de negocio**, facilitando el mantenimiento y la extensibilidad.

---

## 2. Estructura de carpetas relevante

- `src/main.tsx`
  - Punto de entrada de React. Renderiza `MatricuApp` y carga estilos globales.

- `src/MatricuApp.tsx`
  - Componente raíz que orquesta el router y el provider de Redux.

- `src/router/AppRouter.tsx`
  - Router mínimo que decide qué pantalla mostrar en función del estado de autenticación (`LoginPage` o `DashboardPage`).

- `src/auth/`
  - Contiene la pantalla de login (`LoginPage.tsx`).

- `src/dashboard/`
  - `DashboardPage.tsx`: página principal post-login.
  - `components/`: paneles y componentes visuales (por ejemplo `CursoPanel`, `AddCursoPanel`, tarjetas de curso, filtros, etc.).
  - `hook/useAddCursoPanel.ts`: orquesta toda la lógica de selección de cursos, créditos y validaciones.

- `src/store/`
  - `store.ts`: configuración de Redux Toolkit.
  - `auth/authSlice.ts`: estado de autenticación.
  - `dashboard/dashboardSlice.ts`: estado del dashboard (cursos, créditos, vista, errores).
  - `dashboard/addCursosSlice.ts`: estado de apertura/cierre del panel lateral de cursos.

- `src/hook/`
  - `hooks.ts`: hooks base `useAppDispatch` y `useAppSelector` tipados.
  - `useAuthStore.ts`: fachada de dominio para autenticación.
  - `useDashboardStore.ts`: fachada de dominio para el dashboard y matrícula.

- `src/helpers/`
  - `loadDashboard.ts`: funciones para hidratar estado desde `localStorage` (cursos y estudiante autenticado).

- `src/types/`
  - `types.ts`: tipos de dominio (`Curso`, `Estudiante`, `ViewMode`).
  - `schemas.ts`: validaciones con Zod para cursos y estudiantes.

- `src/mock/`
  - Datos de ejemplo usados para poblar `localStorage` y simular un backend inicial.

---

## 3. Patrones y decisiones principales

### 3.1 Redux Toolkit como single source of truth

Se eligió **Redux Toolkit** para manejar el estado global por varias razones:

- Simplifica la definición de slices y reducers inmutables.
- Centraliza información crítica para la lógica de negocio:
  - Autenticación (`authSlice`).
  - Cursos, créditos y estado del dashboard (`dashboardSlice`).
  - Apertura del panel de adición de cursos (`cursoPanelSlice`).
- Facilita la depuración y escalabilidad si el proyecto creciera.

Esto permite que la UI sea esencialmente una proyección del estado global, y que las reglas de negocio se expresen a nivel de acciones y reducers.

### 3.2 Hooks personalizados como fachada (facade) de dominio

En lugar de que cada componente interactúe directamente con `useDispatch` y `useSelector`, se definen hooks de dominio:

- `useAuthStore`
  - Expone propiedades: `status`, `user`, `errorMessage`.
  - Expone métodos de alto nivel: `startLogin`, `checkAuthSession`, `startLogout`.
  - Maneja la lectura/escritura de `localStorage` para sesión (`userId`) y estudiantes.

- `useDashboardStore`
  - Expone propiedades: `cursosMatriculados`, `creditosMatriculados`, `creditosPermitidos`, `cursos`.
  - Expone métodos: `loadDashBoard`, `startAddCursosMatriculados`, `startRemoveCursosMatriculados`.
  - Encapsula las operaciones de lectura/escritura en `localStorage` y las actualizaciones a los slices.

- `useAddCursoPanel`
  - Construye sobre `useDashboardStore` y `useAuthStore`.
  - Contiene TODA la lógica de interacción del panel lateral: filtros, búsqueda, reglas de habilitación, confirmación, toasts, etc.

Este enfoque sigue un patrón similar a **facade** o **controller hook**: los componentes consumen una API declarativa de dominio y no conocen detalles de Redux ni de `localStorage`.

### 3.3 Validación de datos con Zod

Se utiliza **Zod** para validar estructuras que provienen de `localStorage` (simulando un backend):

- Esquemas como `CursoSchemaArray`, `EstudianteSchemaArray` y `EstudianteAuthSchemaArray` garantizan que los datos tienen la forma esperada.
- Ante datos corruptos o incompatibles, se evita que la aplicación falle silenciosamente.

Esta capa de validación protege a la lógica de negocio de dependencias frágiles en el origen de datos.

### 3.4 LocalStorage como infraestructura simulada

En ausencia de un backend real, `localStorage` actúa como:

- **Fuente de verdad** para:
  - Estudiantes (incluyendo créditos y cursos ya matriculados).
  - Listado de cursos y sus cupos.
- **Persistencia** entre recargas del navegador.

Las operaciones principales son:

- Carga inicial de cursos y estudiante autenticado (`loadDashboard.ts`).
- Actualización de:
  - `estudiantes`: al agregar o quitar cursos, se actualizan `creditosMatriculados` y `cursosMatriculados`.
  - `cursos`: se incrementa o decrementa `matriculados` para simular el uso de cupos.

### 3.5 División de UI: container/presenter (inspirado)

Aunque no se formaliza estrictamente, la arquitectura tiende a separar:

- **Componentes contenedores** (containers): conectados a hooks de dominio, responsables de orquestar datos y eventos.
  - Ejemplo: `AddCursoPanel`, `CursoPanel`, `DashboardPage`.

- **Componentes de presentación** (presentational): centrados en renderizar props.
  - Ejemplo: tarjetas de curso, filtros, inputs de búsqueda, etc.

Esto mejora la reutilización y facilita pruebas unitarias sobre la lógica aislada en hooks.

---

## 4. Modelado de reglas de negocio

Las reglas requeridas por la prueba se representan de forma explícita en la lógica de los hooks y slices.

### 4.1 Inicio de sesión y sesión persistente

- `useAuthStore.startLogin`:
  - Lee estudiantes desde `localStorage`.
  - Valida el esquema con Zod.
  - Busca el estudiante por ID.
  - Verifica una contraseña fija para la prueba.
  - En caso de éxito, persiste `userId` y dispara `onLogin`.

- `useAuthStore.checkAuthSession`:
  - Se ejecuta al montar `AppRouter`.
  - Revisa si hay `userId` en `localStorage`.
  - Si existe, vuelve a hidratar al estudiante desde `localStorage` y lo inyecta en el store.

### 4.2 Carga de cursos y estudiante

- `loadDashboard.loadCursos` y `loadEstudiante`:
  - Centralizan la lógica de lectura de cursos y estudiante, y despachan acciones a `dashboardSlice`.
  - Mantienen sincronizados:
    - `creditosPermitidos`.
    - `creditosMatriculados`.
    - `cursosMatriculados`.

### 4.3 Selección de cursos y validaciones

En `useAddCursoPanel` se concentra la lógica clave:

- Cálculo de `availableCredits` y `selectedCredits`.
- Filtro por búsqueda y semestre.
- Cálculo de prerequisitos simples mediante `cursosAnteriores` y `cursosPrerequisitos`.
- Función `isCursoHabilitado` que encapsula las reglas:
  - Solo cursos del semestre permitido (actual o posteriores, condicionados por prerequisitos).
  - No permitir cursos sin cupos (`matriculados < limiteCupos`).
  - No exceder los créditos disponibles.

Antes de agregar cursos:

- `handleAddCourses` valida:
  - Que el estudiante esté `matriculado`.
  - Que haya al menos un curso seleccionado.
  - Que no se exceda el límite de créditos.

La confirmación final (`confirmAddCoursesDialog`) delega la actualización permanente a `useDashboardStore.startAddCursosMatriculados`, que actualiza tanto Redux como `localStorage`.

### 4.4 Eliminación de cursos

- `useDashboardStore.startRemoveCursosMatriculados`:
  - Actualiza el estado global (quitando el curso de `cursosMatriculados` y ajustando créditos).
  - Reescribe el estudiante y cursos en `localStorage` para reflejar los cambios.

---

## 5. Trade-offs y alternativas consideradas

- **Redux Toolkit vs Context API**
  - Se eligió Redux Toolkit para tener herramientas más robustas de manejo de estado, mejores devtools y un patrón más escalable si se suman más features.
  - Context habría sido suficiente para un caso pequeño, pero menos explícito a la hora de organizar slices de dominio.

- **LocalStorage vs mock server (MSW / JSON server)**
  - Por simplicidad y alineación con el enunciado, se usó `localStorage`.
  - Una alternativa sería montar un mock de API con MSW o JSON Server, lo que haría la capa de datos más realista pero también más compleja para una prueba corta.

- **Lógica en componentes vs hooks dedicados**
  - Se prefirió extraer lógica compleja a hooks como `useAddCursoPanel`, evitando que componentes de UI crezcan demasiado y mezclen muchas responsabilidades.

---

## 6. Posibles extensiones futuras

- Sustituir `localStorage` por una API REST real conservando la capa de hooks como fachada (bajo impacto en la UI).
- Añadir tests unitarios para:
  - Reducers de `authSlice` y `dashboardSlice`.
  - Lógica de `useAddCursoPanel` (por ejemplo `isCursoHabilitado`).
- Incorporar manejo de horarios, solapamientos de cursos y más reglas complejas.
- Mejorar accesibilidad (roles ARIA, navegación por teclado, contrastes) y añadir i18n.

Esta arquitectura está pensada para ser sencilla pero extensible, facilitando que nuevas reglas de negocio y pantallas se integren sin romper la estructura actual.
