# Plan: Convertir MatricuApp en Monorepo con Backend Spring Boot

## Context

MatricuApp es una app React de matrícula estudiantil que simula su backend con localStorage. El objetivo es convertirla en un monorepo con un backend real en Spring Boot, reemplazando la simulación con una API REST y base de datos H2 en memoria. Esto es para una prueba técnica de entrevista.

---

## 1. Reestructurar como Monorepo

**Mover el frontend a `frontend/`:**
- Mover todos los archivos del proyecto React (src/, public/, package.json, vite.config.ts, tsconfig*.json, etc.) a `frontend/`
- Actualizar `pnpm-workspace.yaml` en la raíz para incluir `packages: ["frontend"]`
- Mantener `.git/` y `.gitignore` en la raíz
- Crear `package.json` raíz minimal para scripts del monorepo

**Archivos raíz resultantes:**
```
MatricuApp/
├── .git/
├── .gitignore (actualizado para incluir backend/)
├── pnpm-workspace.yaml
├── frontend/          ← todo el React app
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── index.html
│   ├── src/
│   └── public/
└── backend/           ← nuevo Spring Boot
    ├── pom.xml
    ├── src/
    └── ...
```

---

## 2. Backend Spring Boot - Estructura

**Crear `backend/` con Maven:**
- Java 21, Spring Boot 4.0.5 (última versión GA estable)
- Dependencias: spring-boot-starter-web, spring-boot-starter-data-jpa, h2, spring-boot-starter-validation

**Paquete base:** `com.matricuapp`

```
backend/src/main/java/com/matricuapp/
├── MatricuAppApplication.java
├── config/
│   └── CorsConfig.java
├── model/
│   ├── Curso.java
│   └── Estudiante.java
├── repository/
│   ├── CursoRepository.java
│   └── EstudianteRepository.java
├── service/
│   ├── CursoService.java
│   ├── EstudianteService.java
│   └── AuthService.java
├── controller/
│   ├── AuthController.java
│   ├── CursoController.java
│   └── EstudianteController.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   └── EnrollRequest.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── BusinessException.java
```

---

## 3. Modelo de Datos JPA

### Curso Entity
```java
@Entity
public class Curso {
    @Id @GeneratedValue
    private Long id;
    private String nombre;
    private String codigo;
    private int creditos;
    private int semestre;
    private int limiteCupos;
    private int matriculados;  // campo calculable, pero lo mantenemos por compatibilidad con el frontend
}
```

### Estudiante Entity
```java
@Entity
public class Estudiante {
    @Id @GeneratedValue
    private Long id;
    private String nombre;
    private String carrera;
    private int semestre;
    private boolean matriculado;
    private int creditosMatriculados;
    private int creditosPermitidos;
    private String password;

    @ManyToMany
    @JoinTable(name = "estudiante_curso",
        joinColumns = @JoinColumn(name = "estudiante_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id"))
    private Set<Curso> cursosMatriculados = new HashSet<>();
}
```

**Nota:** El campo `matriculados` en Curso se puede mantener como campo denormalizado que se incrementa/decrementa al matricular/desmatricular, para mantener compatibilidad con la respuesta JSON actual del frontend.

**Respuesta JSON de Estudiante** devuelve `cursosMatriculados` como `List<Long>` (IDs) para mantener compatibilidad con el frontend existente.

---

## 4. API REST Endpoints

| Método | Endpoint | Descripción | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/login` | Login | `{ id, password }` | `{ id, nombre, carrera, semestre, matriculado }` |
| POST | `/api/auth/logout` | Logout | - | 200 OK |
| GET | `/api/auth/session` | Check session | - | AuthStudent o 401 |
| GET | `/api/cursos` | Listar cursos | - | `Curso[]` |
| GET | `/api/estudiantes/{id}` | Datos estudiante | - | `Estudiante` con cursosMatriculados como IDs |
| POST | `/api/estudiantes/{id}/matricula` | Agregar cursos | `{ cursoIds: [1,2,3] }` | Estudiante actualizado |
| DELETE | `/api/estudiantes/{id}/matricula/{cursoId}` | Quitar curso | - | Estudiante actualizado |

**Autenticación simple:** Basada en sesión HTTP o simplemente stateless (el frontend guarda userId en localStorage como antes, y pasa el ID en las llamadas). Sin JWT por simplicidad.

---

## 5. Validaciones Server-side (Service Layer)

En `EstudianteService`:
1. **Estudiante debe estar matriculado** (`matriculado == true`)
2. **Cursos del semestre correcto** (`curso.semestre == estudiante.semestre`)
3. **No exceder créditos permitidos** (`creditosMatriculados + nuevosCreditos <= creditosPermitidos`)
4. **Cupos disponibles** (`curso.matriculados < curso.limiteCupos`)
5. **Sin duplicados** (verificar que el estudiante no tiene ya el curso)

Lanzar excepciones con mensajes descriptivos que el `GlobalExceptionHandler` convierte en respuestas HTTP 400.

---

## 6. Seed Data (data.sql o CommandLineRunner)

Usar `src/main/resources/data.sql` con H2 para insertar los mismos datos mock:

**6 cursos** (del `cursos.mock.ts`):
- MAT101, PRG201, FIS102, BD202, ALG103, UX203

**1 estudiante** (del `usuario.mock.ts`):
- ID: 101, Juan Pérez, Ingeniería de Sistemas, semestre 2, 20 créditos permitidos, password: "123456"

---

## 7. Configuración Backend

**`application.properties`:**
```properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:matricuapp
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create
spring.jpa.defer-datasource-initialization=true
```

**CORS:** Permitir `http://localhost:5173` (Vite dev server)

---

## 8. Cambios Frontend

### 8.1 Crear capa API (`frontend/src/api/`)

**`frontend/src/api/matricuApi.ts`:**
```typescript
const BASE_URL = "/api";

export const matricuApi = {
  login: (id: number, password: string) => 
    fetch(`${BASE_URL}/auth/login`, { method: "POST", body: JSON.stringify({id, password}), headers: {"Content-Type": "application/json"} }).then(r => ...),
  
  checkSession: () =>
    fetch(`${BASE_URL}/auth/session`).then(r => ...),
  
  getCursos: () =>
    fetch(`${BASE_URL}/cursos`).then(r => r.json()),
  
  getEstudiante: (id: number) =>
    fetch(`${BASE_URL}/estudiantes/${id}`).then(r => r.json()),
  
  addMatricula: (estudianteId: number, cursoIds: number[]) =>
    fetch(`${BASE_URL}/estudiantes/${estudianteId}/matricula`, { method: "POST", body: JSON.stringify({cursoIds}), headers: {"Content-Type": "application/json"} }).then(r => r.json()),
  
  removeMatricula: (estudianteId: number, cursoId: number) =>
    fetch(`${BASE_URL}/estudiantes/${estudianteId}/matricula/${cursoId}`, { method: "DELETE" }).then(r => r.json()),
};
```

### 8.2 Modificar Hooks

**`useAuthStore.ts`** - Reemplazar localStorage con `matricuApi.login()`, `matricuApi.checkSession()`
- `startLogin()`: POST a `/api/auth/login` en vez de buscar en localStorage
- `checkAuthSession()`: GET a `/api/auth/session` con userId guardado
- `startLogout()`: Limpiar userId de localStorage + limpiar Redux

**`useDashboardStore.ts`** - Reemplazar localStorage con API calls
- `loadDashBoard()`: `matricuApi.getCursos()` + `matricuApi.getEstudiante(userId)`
- `startAddCursosMatriculados()`: POST a `/api/estudiantes/{id}/matricula` y luego recargar datos
- `startRemoveCursosMatriculados()`: DELETE a `/api/estudiantes/{id}/matricula/{cursoId}` y luego recargar datos

### 8.3 Modificar helpers

**`loadDashboard.ts`** - Reescribir para usar API en vez de localStorage
**`loadBackend.ts`** - ELIMINAR (los datos seed están en el backend)

### 8.4 Actualizar MatricuApp.tsx

- Eliminar la llamada a `loadBackend()` en el `useEffect`

### 8.5 Configurar Proxy en Vite

**`vite.config.ts`** - Agregar proxy para redirigir `/api` a `http://localhost:8080`:
```typescript
server: {
  proxy: {
    "/api": "http://localhost:8080"
  }
}
```

---

## 9. Archivos a Modificar/Crear

### Backend (nuevos):
- `backend/pom.xml`
- `backend/src/main/java/com/matricuapp/MatricuAppApplication.java`
- `backend/src/main/java/com/matricuapp/config/CorsConfig.java`
- `backend/src/main/java/com/matricuapp/model/Curso.java`
- `backend/src/main/java/com/matricuapp/model/Estudiante.java`
- `backend/src/main/java/com/matricuapp/repository/CursoRepository.java`
- `backend/src/main/java/com/matricuapp/repository/EstudianteRepository.java`
- `backend/src/main/java/com/matricuapp/service/AuthService.java`
- `backend/src/main/java/com/matricuapp/service/EstudianteService.java`
- `backend/src/main/java/com/matricuapp/controller/AuthController.java`
- `backend/src/main/java/com/matricuapp/controller/CursoController.java`
- `backend/src/main/java/com/matricuapp/controller/EstudianteController.java`
- `backend/src/main/java/com/matricuapp/dto/LoginRequest.java`
- `backend/src/main/java/com/matricuapp/dto/LoginResponse.java`
- `backend/src/main/java/com/matricuapp/dto/EnrollRequest.java`
- `backend/src/main/java/com/matricuapp/dto/EstudianteResponse.java`
- `backend/src/main/java/com/matricuapp/exception/GlobalExceptionHandler.java`
- `backend/src/main/java/com/matricuapp/exception/BusinessException.java`
- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/data.sql`

### Frontend (modificados):
- `frontend/src/api/matricuApi.ts` (nuevo)
- `frontend/src/hook/useAuthStore.ts` (reescribir)
- `frontend/src/hook/useDashboardStore.ts` (reescribir)
- `frontend/src/helpers/loadDashboard.ts` (reescribir)
- `frontend/src/MatricuApp.tsx` (quitar loadBackend)
- `frontend/vite.config.ts` (agregar proxy)

### Frontend (eliminar):
- `frontend/src/helpers/loadBackend.ts`
- `frontend/src/mock/cursos.mock.ts` (opcional, ya no se usa)
- `frontend/src/mock/usuario.mock.ts` (opcional, ya no se usa)
- `frontend/src/mock/cursos.json`
- `frontend/src/mock/usuario.json`

### Raíz (modificados):
- `pnpm-workspace.yaml`
- `.gitignore` (agregar target/, .idea/, *.class)

---

## 10. Verificación

1. **Backend:** `cd backend && mvn spring-boot:run` - debe iniciar en puerto 8080
2. **Frontend:** `cd frontend && pnpm dev` - debe iniciar en puerto 5173
3. **Test manual:**
   - Login con ID: 101, password: 123456
   - Ver dashboard con los 6 cursos
   - Agregar cursos y verificar que los créditos se actualizan
   - Quitar un curso y verificar
   - Hacer logout y verificar que redirige a login
4. **H2 Console:** Acceder a `http://localhost:8080/h2-console` para verificar datos
