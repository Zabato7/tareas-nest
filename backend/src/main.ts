import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurarApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configurarApp(app);

  await app.listen(3000);
  console.log('API escuchando en http://localhost:3000/api/tareas');
}
bootstrap();
