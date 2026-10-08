import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configurarApp } from '../src/app.setup';

describe('API /api/tareas (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configurarApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('recorre el CRUD completo', async () => {
    const server = app.getHttpServer();

    const creada = await request(server)
      .post('/api/tareas')
      .send({ titulo: 'Probar e2e', extra: 'se ignora' })
      .expect(201);
    expect(creada.body).toMatchObject({ id: 1, titulo: 'Probar e2e', completada: false });
    expect(creada.body).not.toHaveProperty('extra');

    await request(server).get('/api/tareas').expect(200).expect((res) => {
      expect(res.body).toHaveLength(1);
    });

    await request(server)
      .patch('/api/tareas/1')
      .send({ completada: true })
      .expect(200)
      .expect((res) => expect(res.body.completada).toBe(true));

    await request(server).delete('/api/tareas/1').expect(204);
    await request(server).get('/api/tareas/1').expect(404);
  });

  it('rechaza datos inválidos con 400', async () => {
    const server = app.getHttpServer();

    await request(server).post('/api/tareas').send({ titulo: '' }).expect(400);
    await request(server).post('/api/tareas').send({}).expect(400);
    await request(server).post('/api/tareas').send({ titulo: 'x', completada: 'si' }).expect(400);
    await request(server).get('/api/tareas/abc').expect(400);
  });
});
