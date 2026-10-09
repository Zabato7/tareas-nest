# Tareas · NestJS + Vue

Aplicación de lista de tareas con un backend REST en **NestJS** y un frontend en **Vue 3**. El frontend consume la API para crear, listar, completar y borrar tareas.

## Stack

| Parte | Tecnología |
|---|---|
| Backend | [NestJS 11](https://nestjs.com/) (TypeScript, Express), validación con `class-validator` |
| Frontend | [Vue 3](https://vuejs.org/) con `<script setup>`, empaquetado con [Vite](https://vite.dev/) |
| Tests | [Jest](https://jestjs.io/) + Supertest (backend), [Vitest](https://vitest.dev/) + Vue Test Utils (frontend) |
| CI | [GitHub Actions](https://docs.github.com/actions): compila y ejecuta los tests en cada push |

## Estructura

```
tareas-nest/
├── backend/                  API REST (NestJS)
│   ├── src/
│   │   ├── main.ts           Punto de entrada (puerto 3000)
│   │   ├── app.setup.ts      Prefijo /api, validación y CORS
│   │   └── tareas/           Módulo de tareas: controller, service, DTOs
│   └── test/                 Tests e2e de la API
├── frontend/                 Interfaz web (Vue + Vite)
│   └── src/
│       ├── App.vue           Componente principal
│       └── api.js            Llamadas fetch al backend
└── .github/workflows/ci.yml  Pipeline de CI
```

## Requisitos

- [Node.js](https://nodejs.org/) 24 (la versión que usa la CI) y npm

## Cómo ejecutarlo

Instala las dependencias de cada parte (solo la primera vez):

```bash
cd backend
npm install
cd ../frontend
npm install
```

Después arranca el backend y el frontend, cada uno en su terminal:

```bash
# Terminal 1: API en http://localhost:3000/api/tareas
cd backend
npm run start:dev
```

```bash
# Terminal 2: interfaz en http://localhost:5173
cd frontend
npm run dev
```

Abre **http://localhost:5173** en el navegador. El backend tiene que estar corriendo; si no, la página muestra un aviso.

> **Nota:** las tareas se guardan en memoria, así que se pierden al reiniciar el backend.

## API

Todas las rutas cuelgan de `/api`.

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/api/tareas` | Lista todas las tareas | 200 |
| `GET` | `/api/tareas/:id` | Obtiene una tarea | 200 · 404 |
| `POST` | `/api/tareas` | Crea una tarea | 201 · 400 |
| `PATCH` | `/api/tareas/:id` | Actualiza solo los campos enviados | 200 · 400 · 404 |
| `DELETE` | `/api/tareas/:id` | Elimina una tarea | 204 · 404 |

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Comprar pan"}'
```

```json
{ "id": 1, "titulo": "Comprar pan", "completada": false, "fechaCreacion": "2026-10-09T10:00:00.000Z" }
```

El campo `titulo` es obligatorio (máximo 200 caracteres) y `completada` es un booleano opcional. Si mandas datos inválidos, la API responde 400 con el detalle del error. Los campos que no estén en el DTO se ignoran.

## Pruebas

Cada parte tiene sus propios tests, que se ejecutan con `npm test`:

```bash
cd backend
npm test        # Jest: tests unitarios del servicio + e2e de la API con Supertest
```

```bash
cd frontend
npm test        # Vitest: tests del componente App.vue con la API simulada
```

| Archivo | Qué prueba |
|---|---|
| `backend/src/tareas/tareas.service.spec.ts` | Lógica del servicio: crear, actualizar, borrar y errores 404 |
| `backend/test/tareas.e2e-spec.ts` | Peticiones HTTP reales: CRUD completo y validaciones (400) |
| `frontend/src/App.test.js` | La interfaz carga, añade, marca y borra tareas, y avisa si la API no responde |

## Integración continua

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta en cada push, a cualquier rama. Tiene dos jobs en paralelo, uno para el backend y otro para el frontend, y cada uno hace lo siguiente:

1. Instala Node 24 y las dependencias con `npm ci` (con caché).
2. Compila con `npm run build`.
3. Ejecuta los tests con `npm test`.

El resultado se ve en la pestaña **Actions** del repositorio. Si un paso falla, el commit queda marcado en rojo.
