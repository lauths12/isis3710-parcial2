/* eslint-disable prettier/prettier */

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseñaEntity } from './reseña.entity';

@Injectable()
export class ReseñaService {
  constructor(
    @InjectRepository(ReseñaEntity)
    private readonly reseñaRepository: Repository<ReseñaEntity>,
  ) {}

  async agregarReseña(reseña: ReseñaEntity): Promise<ReseñaEntity> {
    if (reseña.actividad.estado !== 2) {
      throw new BadRequestException('La actividad no está finalizada');
    }
    if (
      !reseña.actividad.estudiantes ||
      !reseña.actividad.estudiantes.some(e => e.id === reseña.estudiante.id)
    ) {
      throw new BadRequestException(
        'El estudiante no estuvo inscrito en esta actividad',
      );
    }
    return this.reseñaRepository.save(reseña);
  }
}
