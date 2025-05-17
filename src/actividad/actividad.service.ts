/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ActividadEntity } from './actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
    if (!actividad.titulo || actividad.titulo.length < 15) {
      throw new BadRequestException('El título debe tener al menos 15 caracteres');
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(actividad.titulo)) {
      throw new BadRequestException('El título no puede tener símbolos');
    }
    actividad.estado = 0;

    return this.actividadRepository.save(actividad);
  }

  async cambiarEstado(id: number, estado: number): Promise<ActividadEntity> {
    const actividad = await this.actividadRepository.findOneBy({ id });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    if (![0, 1, 2].includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }

    if (estado === 1) {
      if (!actividad.cupoMaximo || actividad.cupoMaximo <= 0) {
        throw new BadRequestException('Datos de cupo incompletos');
      }
      throw new BadRequestException(
        'Para validar el 80% del cupo lleno es necesario contar inscritos (no implementado aquí)',
      );
    }

    if (estado === 2) {
      if (actividad.cupoMaximo > 0) {
        throw new BadRequestException('Solo se puede finalizar si no hay cupo disponible');
      }
    }

    actividad.estado = estado;
    return this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    return this.actividadRepository.find({
      where: { fecha },
    });
  }
}
