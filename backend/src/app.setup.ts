import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Configuración común de la app, compartida por main.ts y los tests e2e. */
export function configurarApp(app: INestApplication) {
  // Todas las rutas cuelgan de /api (p. ej. /api/tareas)
  app.setGlobalPrefix('api');

  // Valida los DTO y descarta campos que no estén declarados en ellos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Permite que el frontend de Vite (puerto 5173) llame a la API
  app.enableCors({ origin: 'http://localhost:5173' });
}
