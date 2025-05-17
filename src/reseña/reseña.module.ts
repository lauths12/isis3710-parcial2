/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseñaEntity } from './reseña.entity';
import { ReseñaController } from './reseña.controller';

@Module({
  providers: [ReseñaService],
  imports: [TypeOrmModule.forFeature([ReseñaEntity])],
  controllers: [ReseñaController],
})
export class ReseñaModule {}
