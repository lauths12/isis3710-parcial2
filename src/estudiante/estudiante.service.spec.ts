/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepo: ReturnType<typeof mockRepository>;
  let actividadRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        { provide: 'EstudianteEntityRepository', useFactory: mockRepository },
        { provide: 'ActividadEntityRepository', useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepo = module.get('EstudianteEntityRepository');
    actividadRepo = module.get('ActividadEntityRepository');
  });

  describe('crearEstudiante', () => {
    it('debería crear estudiante correctamente con datos válidos', async () => {
      const estudiante = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        programa: 'Ing. Sistemas',
        semestre: 3,
      } as EstudianteEntity;

      estudianteRepo.save.mockResolvedValue(estudiante);

      const result = await service.crearEstudiante(estudiante);

      expect(result).toEqual(estudiante);
      expect(estudianteRepo.save).toHaveBeenCalledWith(estudiante);
    });

    it('debería lanzar BadRequestException si email es inválido', async () => {
      const estudiante = {
        nombre: 'Juan',
        correo: 'correo-invalido',
        programa: 'Ing. Sistemas',
        semestre: 3,
      } as EstudianteEntity;

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException si semestre es menor que 1', async () => {
      const estudiante = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        programa: 'Ing. Sistemas',
        semestre: 0,
      } as EstudianteEntity;

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException si semestre es mayor que 10', async () => {
      const estudiante = {
        nombre: 'Juan',
        correo: 'juan@example.com',
        programa: 'Ing. Sistemas',
        semestre: 11,
      } as EstudianteEntity;

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findEstudianteById', () => {
    it('debería retornar estudiante con actividades si existe', async () => {
      const estudiante = {
        id: 1,
        nombre: 'Juan',
        actividades: [],
      } as unknown as EstudianteEntity;

      estudianteRepo.findOne.mockResolvedValue(estudiante);

      const result = await service.findEstudianteById(1);

      expect(estudianteRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['actividades'],
      });
      expect(result).toEqual(estudiante);
    });

    it('debería lanzar NotFoundException si no existe el estudiante', async () => {
      estudianteRepo.findOne.mockResolvedValue(undefined);

      await expect(service.findEstudianteById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('inscribirseActividad', () => {
    const estudiante = { id: 1 } as EstudianteEntity;

    it('debería inscribir estudiante a actividad si todo es válido', async () => {
      const actividad = {
        id: 2,
        estado: 0,
        cupoMaximo: 2,
        estudiantes: [],
        save: jest.fn(),
      } as any as ActividadEntity; 

      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue(actividad);
      actividadRepo.save.mockResolvedValue(actividad);

      actividad.estudiantes.push = jest.fn();

      const result = await service.inscribirseActividad(
        estudiante.id,
        actividad.id,
      );

      expect(estudianteRepo.findOne).toHaveBeenCalledWith({
        where: { id: estudiante.id },
      });
      expect(actividadRepo.findOne).toHaveBeenCalledWith({
        where: { id: actividad.id },
        relations: ['estudiantes'],
      });
      expect(actividad.estudiantes.push).toHaveBeenCalledWith(estudiante);
      expect(actividadRepo.save).toHaveBeenCalledWith(actividad);
      expect(result).toEqual(actividad);
    });

    it('debería lanzar NotFoundException si estudiante no existe', async () => {
      estudianteRepo.findOne.mockResolvedValue(undefined);

      await expect(service.inscribirseActividad(99, 2)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar NotFoundException si actividad no existe', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue(undefined);

      await expect(service.inscribirseActividad(1, 99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar BadRequestException si actividad no está disponible', async () => {
      const actividad = {
        id: 2,
        estado: 1,
        cupoMaximo: 2,
        estudiantes: [],
      } as unknown as ActividadEntity;

      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue(actividad);

      await expect(service.inscribirseActividad(1, 2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException si no hay cupo', async () => {
      const actividad = {
        id: 2,
        estado: 0,
        cupoMaximo: 1,
        estudiantes: [{ id: 10 }],
      } as ActividadEntity;

      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue(actividad);

      await expect(service.inscribirseActividad(1, 2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException si estudiante ya está inscrito', async () => {
      const actividad = {
        id: 2,
        estado: 0,
        cupoMaximo: 2,
        estudiantes: [{ id: 1 }],
      } as ActividadEntity;

      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue(actividad);

      await expect(service.inscribirseActividad(1, 2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
