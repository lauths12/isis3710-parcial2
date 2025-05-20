/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ActividadEntity } from './actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(actividad: ActividadEntity): Promise<ActividadEntity> {
    if (!actividad.titulo || actividad.titulo.length < 15) {
      throw new BadRequestException(
        'El título debe tener al menos 15 caracteres',
      );
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

    if (estado === 1 && actividad.estado === 0) {
      const cupoLleno = actividad.estudiantes.length * 0.8;
      if (actividad.estudiantes.length < cupoLleno) {
        throw new BadRequestException(
          'No se puede cerrar la actividad: se requiere al menos el 80% de participación de los estudiantes registrados',
        );
      }
    }

    if (estado === 2) {
      if (actividad.cupoMaximo > 0) {
        throw new BadRequestException(
          'Solo se puede finalizar si no hay cupo disponible',
        );
      }
    }

    actividad.estado = estado;
    return this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    if (!fecha) {
      throw new BadRequestException('La fecha es obligatoria');
    }

    return await this.actividadRepository.find({
      where: { fecha },
      relations: ['estudiantes', 'reseñas'],
    });
  }
}
