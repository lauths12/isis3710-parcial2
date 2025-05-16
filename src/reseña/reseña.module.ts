/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';

@Module({
  providers: [ReseñaService],
  imports: [TypeOrmModule.forFeature([ReseñaEntity])],
})
export class ReseñaModule {}
