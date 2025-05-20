/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
});

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        { provide: getRepositoryToken(ActividadEntity), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepo = module.get(getRepositoryToken(ActividadEntity));
  });

  describe('crearActividad', () => {
    it('debe crear una actividad correctamente', async () => {
      const actividad = {
        // Sin tildes para que pase la validación del regex actual
        titulo: 'Titulo valido con mas de 15 caracteres',
        fecha: '2025-05-17',
        cupoMaximo: 20,
        estado: 1,
      } as ActividadEntity;

      actividadRepo.save.mockResolvedValue({
        ...actividad,
        estado: 0,
      });

      const result = await service.crearActividad(actividad);

      expect(actividadRepo.save).toHaveBeenCalledWith({
        ...actividad,
        estado: 0,
      });
      expect(result.estado).toBe(0);
    });

    it('debe lanzar BadRequestException si el título es menor a 15 caracteres', async () => {
      const actividad = {
        titulo: 'Muy corto',
      } as ActividadEntity;

      await expect(service.crearActividad(actividad)).rejects.toThrow(BadRequestException);
      await expect(service.crearActividad(actividad)).rejects.toThrow('El título debe tener al menos 15 caracteres');
      expect(actividadRepo.save).not.toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el título tiene símbolos', async () => {
      const actividad = {
        titulo: 'Titulo invalido!!!',
      } as ActividadEntity;

      await expect(service.crearActividad(actividad)).rejects.toThrow(BadRequestException);
      await expect(service.crearActividad(actividad)).rejects.toThrow('El título no puede tener símbolos');
      expect(actividadRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAllActividadesByDate', () => {
    it('debe retornar actividades por fecha', async () => {
      const fecha = '2025-05-17';
      const actividades = [
        {
          id: 1,
          titulo: 'Actividad ejemplo con titulo valido',
          fecha,
          cupoMaximo: 10,
          estado: 0,
          estudiantes: [],
          reseñas: [],
        },
      ] as ActividadEntity[];

      actividadRepo.find.mockResolvedValue(actividades);

      const result = await service.findAllActividadesByDate(fecha);

      expect(actividadRepo.find).toHaveBeenCalledWith({
        where: { fecha },
        relations: ['estudiantes', 'reseñas'],
      });
      expect(result).toEqual(actividades);
    });

    it('debe lanzar BadRequestException si no se pasa fecha', async () => {
      await expect(service.findAllActividadesByDate('')).rejects.toThrow('La fecha es obligatoria');
      expect(actividadRepo.find).not.toHaveBeenCalled();
    });
  });
});
