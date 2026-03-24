# KaliumTaskSystem

Este proyecto es un gestor de tareas seguro y eficiente desarrollado como parte de una prueba técnica para **Kalium**.

## Tecnologías Utilizadas

- **Frontend:** React + TypeScript + Vite + TailwindCSS + Lucide Icons.
- **Backend:** NestJS + TypeORM + SQLite3.
- **Seguridad:** Helmet, Rate Limiting, CORS, Validation Pipes.
- **Infraestructura:** Docker & Docker Compose.

## Características

- **CRUD Completo:** Creación, listado, actualización de estado y eliminación de tareas.
- **Prioridades:** Soporta niveles de prioridad `LOW`, `MEDIUM` y `HIGH`.
- **Modo Kalium:** Funcionalidad que filtra y destaca tareas de alta prioridad.
- **Persistencia:** Uso de SQLite para almacenamiento local persistente.
- **Diseño:** Interfaz oscura, moderna y responsiva inspirada en Shadcn UI.

## Requisitos Previos

- Docker
- Docker Compose

## Ejecución

Para iniciar todo el sistema (Frontend, Backend y BD) con un solo comando, ejecute desde la raíz del proyecto:

```bash
docker-compose up --build
```

Una vez que los contenedores estén en ejecución:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:3001](http://localhost:3001)

## Lógica Implementada

- **Clase TaskManager:** Ubicada en `api/src/tasks/task-manager.service.ts`.
- **Método activateKaliumMode():** Filtra tareas con prioridad `HIGH`.
- **Mensaje de Inicio:** Se muestra `[Kalium] Task System Inicializado` en los logs del backend al arrancar.
- **Tareas Precargadas:** El sistema inicializa automáticamente las 3 tareas solicitadas:
  1. "Pentesting web app" (HIGH)
  2. "Desarrollo backend modulo" (MEDIUM)
  3. "Analisis software sospechoso" (HIGH)

## Seguridad

El sistema implementa:

- **Helmet:** Cabeceras de seguridad HTTP.
- **Rate Limiting:** Protección contra ataques de fuerza bruta (100 peticiones cada 15 min por IP).
- **CORS:** Configuración segura de orígenes.
- **Validation Pipes:** Validación estricta de datos de entrada.

---

**Kalium Task System** - _Security First._
