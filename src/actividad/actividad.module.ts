/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity';

@Module({
  providers: [ActividadService],
  imports: [TypeOrmModule.forFeature([ActividadEntity])],
})
export class ActividadModule {}
