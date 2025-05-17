/* eslint-disable prettier/prettier */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  private validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    if (!this.validarEmail(estudiante.correo)) {
      throw new BadRequestException('Email no válido');
    }

    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BadRequestException('El semestre debe estar entre 1 y 10');
    }

    return this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['actividades'],
    });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }
    return estudiante;
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
