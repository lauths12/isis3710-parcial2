/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { ActividadEntity } from 'src/actividad/actividad.entity';
import { EstudianteActividadService } from './estudiante-actividad.service';
import { EstudianteActividadController } from './estudiante-actividad.controller';

@Module({
   imports: [TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity])],
  providers: [EstudianteService, EstudianteActividadService],
  controllers: [EstudianteActividadController],
})
export class EstudianteModule {}
