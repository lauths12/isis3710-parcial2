/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ActividadEntity } from './actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
    if (!actividad.titulo || actividad.titulo.length < 15) {
      throw new Error('El título debe tener al menos 15 caracteres');
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(actividad.titulo)) {
      throw new Error('El título no puede tener símbolos');
    }

    return this.actividadRepository.save(actividad);
  }

  async cambiarEstado(id: number, estado: number): Promise<ActividadEntity> {
    const actividad = await this.actividadRepository.findOneBy({ id });
    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }
    
    if (![0, 1, 2].includes(estado)) {
      throw new Error('Estado inválido');
    }

    if (estado === 1) {
      if (!actividad.cupoMaximo) {
        throw new Error('Datos de cupo incompletos');
      }
      const porcentaje = (actividad.cupoMaximo) * 100;
      if (porcentaje < 80) {
        throw new Error('Solo se puede cerrar si el 80% del cupo está lleno');
      }
    }

    if (estado === 2) {
      if (actividad.cupoMaximo > 0) {
        throw new Error('Solo se puede finalizar si no hay cupo disponible');
      }
    }

    actividad.estado = estado;
    return this.actividadRepository.save(actividad);
  }
}
