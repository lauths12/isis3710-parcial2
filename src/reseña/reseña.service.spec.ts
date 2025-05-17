/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ReseñaService } from './reseña.service';
import { ReseñaEntity } from './reseña.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('ReseñaService', () => {
  let service: ReseñaService;
  let reseñaRepo: ReturnType<typeof mockRepository>;
  let actividadRepo: ReturnType<typeof mockRepository>;
  let estudianteRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReseñaService,
        { provide: 'ReseñaEntityRepository', useFactory: mockRepository },
        { provide: 'ActividadEntityRepository', useFactory: mockRepository },
        { provide: 'EstudianteEntityRepository', useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ReseñaService>(ReseñaService);
    reseñaRepo = module.get('ReseñaEntityRepository');
    actividadRepo = module.get('ActividadEntityRepository');
    estudianteRepo = module.get('EstudianteEntityRepository');
  });

  const estudiante: EstudianteEntity = {
    id: 1,
    nombre: 'Ana Pérez',
    correo: 'ana@mail.com',
    programa: 'Sistemas',
    semestre: 3,
    actividades: [],
    reseñas: [],
  };

  const actividad: ActividadEntity = {
    id: 10,
    titulo: 'Actividad Finalizada',
    fecha: '2025-05-17',
    cupoMaximo: 5,
    estado: 2, 
    estudiantes: [estudiante],
    reseñas: [],
  };

  const reseña: ReseñaEntity = {
    id: 100,
    comentario: 'Muy buena actividad',
    calificacion: 5,
    fecha: '2025-05-18',
    actividad,
    estudiante,
  };

  describe('agregarReseña', () => {
    it('guarda la reseña si todo es válido', async () => {
      actividadRepo.findOne.mockResolvedValue(actividad);
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      reseñaRepo.save.mockResolvedValue(reseña);

      const result = await service.agregarReseña(reseña);

      expect(actividadRepo.findOne).toHaveBeenCalledWith({
        where: { id: actividad.id },
        relations: ['estudiantes'],
      });
      expect(estudianteRepo.findOne).toHaveBeenCalledWith({ where: { id: estudiante.id } });
      expect(reseñaRepo.save).toHaveBeenCalledWith(reseña);
      expect(result).toEqual(reseña);
    });

    it('lanza NotFoundException si la actividad no existe', async () => {
      actividadRepo.findOne.mockResolvedValue(undefined);

      await expect(service.agregarReseña(reseña)).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequestException si la actividad no está finalizada', async () => {
      const actNoFinal: ActividadEntity = { ...actividad, estado: 1 };
      actividadRepo.findOne.mockResolvedValue(actNoFinal);

      await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    });

    it('lanza NotFoundException si el estudiante no existe', async () => {
      actividadRepo.findOne.mockResolvedValue(actividad);
      estudianteRepo.findOne.mockResolvedValue(undefined);

      await expect(service.agregarReseña(reseña)).rejects.toThrow(NotFoundException);
    });

    it('lanza BadRequestException si el estudiante no estuvo inscrito', async () => {
      const otroEst: EstudianteEntity = { ...estudiante, id: 2 };
      const act: ActividadEntity = { ...actividad, estudiantes: [otroEst] };
      actividadRepo.findOne.mockResolvedValue(act);
      estudianteRepo.findOne.mockResolvedValue(estudiante);

      await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    });
  });
});

