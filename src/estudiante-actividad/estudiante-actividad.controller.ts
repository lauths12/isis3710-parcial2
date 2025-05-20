/* eslint-disable prettier/prettier */
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EstudianteActividadService } from './estudiante-actividad.service';
import { ActividadEntity } from '../actividad/actividad.entity';

@Controller('estudiantes')
export class EstudianteActividadController {
  constructor(private readonly estudianteActividadService: EstudianteActividadService) {}

  @Post(':estudianteId/actividades/:actividadId')
  async inscribirseActividad(
    @Param('estudianteId', ParseIntPipe) estudianteId: number,
    @Param('actividadId', ParseIntPipe) actividadId: number,
  ): Promise<ActividadEntity> {
    return await this.estudianteActividadService.inscribirseActividad(estudianteId, actividadId);
  }


}
