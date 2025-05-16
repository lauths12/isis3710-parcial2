/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async findEstudianteById(id: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });
    if (!estudiante) {
      throw new BadRequestException(`Usuario con id ${id} no encontrado`);
    }
    return estudiante;
  }

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BadRequestException('El semestre debe estar entre 1 y 10');
    }
    return this.estudianteRepository.save(estudiante);
  }
}
