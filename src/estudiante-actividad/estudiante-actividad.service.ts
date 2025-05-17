/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class EstudianteActividadService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async addActividadEstudiante(
    estudianteId: number,
    actividadId: number,
  ): Promise<EstudianteEntity> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
    });
    if (!actividad)
      throw new NotFoundException(
        'The actividad with the given id was not found',
      );

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });
    if (!estudiante)
      throw new NotFoundException(
        'The Estudiante with the given id was not found',
      );

    estudiante.actividades = [...estudiante.actividades, actividad];
    return await this.estudianteRepository.save(estudiante);
  }

  async inscribirseActividad(
    estudianteId: number,
    actividadId: number,
  ): Promise<ActividadEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
    });
    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con id ${estudianteId} no encontrado`,
      );
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException(
        `Actividad con id ${actividadId} no encontrada`,
      );
    }

    if (actividad.estado !== 0) {
      throw new BadRequestException(
        'La actividad no está en estado disponible (0)',
      );
    }

    if (actividad.estudiantes.length >= actividad.cupoMaximo) {
      throw new BadRequestException('La actividad no tiene cupo disponible');
    }

    const estaInscrito = actividad.estudiantes.some(
      (est) => est.id === estudiante.id,
    );
    if (estaInscrito) {
      throw new BadRequestException(
        'El estudiante ya está inscrito en esta actividad',
      );
    }

    actividad.estudiantes.push(estudiante);
    await this.actividadRepository.save(actividad);
    return actividad;
  }
}
