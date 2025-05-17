/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';


@Injectable()
export class EstudianteactividadService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,

    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async addActividadEstudiante(estudianteId: number, actividadId: number): Promise<EstudianteEntity> {
    const actividad = await this.actividadRepository.findOne({ where: { id: actividadId } });
    if (!actividad)
      throw new NotFoundException('The actividad with the given id was not found');

    const estudiante = await this.estudianteRepository.findOne({ where: { id:estudianteId }, relations: ['actividades'] });
    if (!estudiante)
      throw new NotFoundException('The Estudiante with the given id was not found');

    estudiante.actividades = [...estudiante.actividades, actividad];
    return await this.estudianteRepository.save(estudiante);
  }


}
