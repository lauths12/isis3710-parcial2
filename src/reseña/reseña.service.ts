/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
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
    return this.reseñaRepository.save(reseña);
  }
}
