/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,

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
}
