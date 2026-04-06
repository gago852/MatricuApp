# MatricuApp

Aplicación de matriculación académica construida como **monorepo** con un frontend en **React + TypeScript + Vite** y un backend real en **Spring Boot + PostgreSQL**.

El objetivo principal es cubrir los requerimientos funcionales de la prueba técnica y, al mismo tiempo, mostrar buenas prácticas en organización de código, manejo de estado global, autenticación con JWT y arquitectura por dominio en el backend.

---

## Estructura del proyecto

```
MatricuApp/
├── frontend/        # React + TypeScript + Vite
└── backend/         # Spring Boot 4 + Java 25 + PostgreSQL
```

---

## Despliegue

| Capa | Plataforma | Dominio |
|------|-----------|---------|
| Frontend | Netlify | `matricuapp.gabogomez.dev` |
| Backend | Render | `api-matricuapp.gabogomez.dev` |
| Base de datos | Neon (PostgreSQL serverless) | — |

---

## Ejecutar en local

### Requisitos previos

- Node.js 18+ y pnpm
- Java 25
- Docker (para la base de datos local)

### 1. Base de datos (Docker)

```bash
cd backend
docker compose up -d
```

Levanta un PostgreSQL en `localhost:5432` con usuario/contraseña/db `matricuapp`.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

El servidor arranca en `http://localhost:8080`. El perfil `dev` conecta automáticamente al docker-compose local sin necesidad de configurar variables de entorno.

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Credenciales de prueba

| Campo | Valor |
|-------|-------|
| ID de estudiante | `101` |
| Contraseña | `123456` |

---

## Variables de entorno

### Frontend

| Variable | Dev | Prod (Netlify) |
|----------|-----|----------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | `https://api-matricuapp.gabogomez.dev/api` |

### Backend

| Variable | Dev (default) | Prod (Render) |
|----------|--------------|---------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/matricuapp` | Connection string Neon |
| `DATABASE_USERNAME` | `matricuapp` | Usuario Neon |
| `DATABASE_PASSWORD` | `matricuapp` | Contraseña Neon |
| `JWT_SECRET` | `dev-secret-key-...` | String seguro >= 256 bits |
| `SPRING_PROFILES_ACTIVE` | `dev` | `prod` |
| `PORT` | `8080` | Inyectado por Render |

---

## API REST

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login devuelve token JWT |
| GET | `/api/auth/renew` | Bearer | Renueva el JWT |
| GET | `/api/cursos` | Bearer | Lista todos los cursos |
| GET | `/api/estudiantes/{id}` | Bearer | Datos del estudiante |
| POST | `/api/estudiantes/{id}/matricula` | Bearer | Agregar cursos |
| DELETE | `/api/estudiantes/{id}/matricula/{cursoId}` | Bearer | Quitar un curso |

### Autenticación JWT

- El login devuelve un token con expiración de **1 hora**.
- El frontend lo envía en el header `Authorization: Bearer <token>`.
- Token vencido -> el backend responde `401` -> el frontend cierra sesión automáticamente.
- `checkAuthSession` llama a `/api/auth/renew` al recargar la página para renovar el token silenciosamente.

---

## Arquitectura backend

Organización por dominio/feature:

```
src/main/java/com/matricuapp/matricuapp_backend/
├── auth/          # Login, JWT, filtro de autenticación
├── curso/         # Entidad, repositorio, servicio, controlador
├── estudiante/    # Entidad, repositorio, servicio, controlador
├── config/        # AppProperties, CORS, Security
└── exception/     # GlobalExceptionHandler, BusinessException
```

**Stack:** Spring Boot 4.0.5 · Spring Security · Spring Data JPA · Hibernate 7 · JJWT 0.12.6 · BCrypt · PostgreSQL

---

## Arquitectura frontend

```
src/
├── api/           # matricuApi.ts — cliente axios con interceptores JWT
├── auth/          # Página de login
├── dashboard/     # Página principal y componentes de matrícula
├── hook/          # useAuthStore, useDashboardStore
├── store/         # Redux Toolkit (authSlice, dashboardSlice)
├── router/        # AppRouter
└── types/         # Tipos TypeScript compartidos
```

**Stack:** React 18 · TypeScript · Redux Toolkit · axios · Vite · Tailwind CSS · shadcn/ui

---

## Reglas de negocio (validadas en el backend)

- El estudiante debe estar activo (`matriculado = true`).
- Solo puede matricular cursos de su semestre.
- El curso debe tener cupos disponibles.
- No puede duplicar un curso ya matriculado.
- Los créditos totales no pueden superar el límite permitido.

---

## Despliegue en producción

### Render (backend)

1. Conectar repositorio -> seleccionar directorio `backend/`
2. Render detecta el `Dockerfile` automáticamente
3. Configurar variables: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET`, `SPRING_PROFILES_ACTIVE=prod`

### Netlify (frontend)

1. Conectar repositorio -> directorio base: `frontend/`
2. Build command: `pnpm build` · Publish directory: `dist`
3. Variable de entorno: `VITE_API_BASE_URL=https://api-matricuapp.gabogomez.dev/api`
4. El archivo `netlify.toml` ya incluye la regla de redirect para SPA

### DNS

- `matricuapp.gabogomez.dev` -> CNAME al dominio de Netlify
- `api-matricuapp.gabogomez.dev` -> CNAME al dominio de Render
