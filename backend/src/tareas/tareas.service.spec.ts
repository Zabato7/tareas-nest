import { NotFoundException } from '@nestjs/common';
import { TareasService } from './tareas.service';

describe('TareasService', () => {
  let service: TareasService;

  beforeEach(() => {
    service = new TareasService();
  });

  it('empieza sin tareas', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('crea tareas con ids incrementales y sin completar', () => {
    const a = service.create({ titulo: '  Comprar pan  ' });
    const b = service.create({ titulo: 'Lavar ropa', completada: true });

    expect(a).toMatchObject({ id: 1, titulo: 'Comprar pan', completada: false });
    expect(b).toMatchObject({ id: 2, completada: true });
    expect(service.findAll()).toHaveLength(2);
  });

  it('actualiza solo los campos enviados', () => {
    const t = service.create({ titulo: 'Original' });

    service.update(t.id, { completada: true });
    expect(service.findOne(t.id)).toMatchObject({ titulo: 'Original', completada: true });

    service.update(t.id, { titulo: 'Nuevo' });
    expect(service.findOne(t.id)).toMatchObject({ titulo: 'Nuevo', completada: true });
  });

  it('elimina una tarea', () => {
    const t = service.create({ titulo: 'Borrar' });
    service.remove(t.id);
    expect(service.findAll()).toEqual([]);
  });

  it('lanza NotFoundException con ids inexistentes', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
    expect(() => service.update(99, { completada: true })).toThrow(NotFoundException);
    expect(() => service.remove(99)).toThrow(NotFoundException);
  });
});
