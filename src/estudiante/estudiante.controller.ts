/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { EstudianteDto } from '../estudiante/estudiante.dto/estudiante.dto';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(@Body() estudianteDto: EstudianteDto): Promise<EstudianteEntity> {
    const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  @Get(':id')
  async obtenerEstudiantePorId(@Param('id') id: number): Promise<EstudianteEntity> {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('El ID debe ser un número');
    }
    return await this.estudianteService.findEstudianteById(idNum);
  }
}
