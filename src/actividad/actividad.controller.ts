/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { ActividadDto } from '../actividad/actividad.dto/actividad.dto';

@Controller('actividades')
export class ActividadController {
  estudianteActividadService: any;
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crearActividad(
    @Body() actividadDto: ActividadDto,
  ): Promise<ActividadEntity> {
    const actividad: ActividadEntity = plainToInstance(
      ActividadEntity,
      actividadDto,
    );
    return await this.actividadService.crearActividad(actividad);
  }

  @Get(':fecha')
  async findAllByFecha(
    @Param('fecha') fecha: string,
  ): Promise<ActividadEntity[]> {
    return await this.actividadService.findAllActividadesByDate(fecha);
  }

  @Put(':actividadId')
  async cambiarEstadoActividad(
    @Param('actividadId') actividadId: number,
    @Body() actividad: ActividadDto,
  ): Promise<ActividadEntity> {
    const estado = actividad.estado;
    return await this.actividadService.cambiarEstado(actividadId, estado );
  }

}
