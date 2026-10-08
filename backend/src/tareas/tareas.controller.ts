import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { TareasService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  findAll() {
    return this.tareasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CrearTareaDto) {
    return this.tareasService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarTareaDto) {
    return this.tareasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tareasService.remove(id);
  }
}
