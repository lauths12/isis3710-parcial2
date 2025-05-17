/* eslint-disable prettier/prettier */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseñaEntity } from './reseña.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Injectable()
export class ReseñaService {
  constructor(
    @InjectRepository(ReseñaEntity)
    private readonly reseñaRepository: Repository<ReseñaEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,

    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async agregarReseña(reseña: ReseñaEntity): Promise<ReseñaEntity> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: reseña.actividad.id },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (actividad.estado !== 2) {
      throw new BadRequestException('La actividad no está finalizada');
    }

    const estudiante = await this.estudianteRepository.findOne({ where: { id: reseña.estudiante.id } });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const estaInscrito = actividad.estudiantes.some(est => est.id === estudiante.id);
    if (!estaInscrito) {
      throw new BadRequestException('El estudiante no estuvo inscrito en esta actividad');
    }

    return this.reseñaRepository.save(reseña);
  }
}
