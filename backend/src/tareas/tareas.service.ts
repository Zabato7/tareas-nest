import { Injectable, NotFoundException } from '@nestjs/common';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { Tarea } from './tarea.entity';

/** Guarda las tareas en memoria: se pierden al reiniciar el servidor. */
@Injectable()
export class TareasService {
  private tareas: Tarea[] = [];
  private siguienteId = 1;

  findAll(): Tarea[] {
    return this.tareas;
  }

  findOne(id: number): Tarea {
    const tarea = this.tareas.find((t) => t.id === id);
    if (!tarea) throw new NotFoundException(`No existe la tarea ${id}`);
    return tarea;
  }

  create(dto: CrearTareaDto): Tarea {
    const tarea: Tarea = {
      id: this.siguienteId++,
      titulo: dto.titulo.trim(),
      completada: dto.completada ?? false,
      fechaCreacion: new Date().toISOString(),
    };
    this.tareas.push(tarea);
    return tarea;
  }

  update(id: number, dto: ActualizarTareaDto): Tarea {
    const tarea = this.findOne(id);
    if (dto.titulo !== undefined) tarea.titulo = dto.titulo.trim();
    if (dto.completada !== undefined) tarea.completada = dto.completada;
    return tarea;
  }

  remove(id: number): void {
    this.findOne(id);
    this.tareas = this.tareas.filter((t) => t.id !== id);
  }
}
