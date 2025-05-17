/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity';
import { ActividadController } from './actividad.controller';

@Module({
  providers: [ActividadService],
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
  controllers: [ActividadController],
})
export class ActividadModule {}
