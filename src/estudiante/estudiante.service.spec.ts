/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepo: ReturnType<typeof mockRepository>;

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
});
