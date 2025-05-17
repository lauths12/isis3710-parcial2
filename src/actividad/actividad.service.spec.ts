/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock básico repositorio
const mockRepository = () => ({
  findOneBy: jest.fn(),
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
        { provide: 'ActividadEntityRepository', useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepo = module.get('ActividadEntityRepository');
  });

  describe('crearActividad', () => {
    it('debería crear actividad con título válido', async () => {
      const actividad: ActividadEntity = {
        id: 1,
        titulo: 'Actividad de prueba 123',
        fecha: '2025-05-17',
        cupoMaximo: 10,
        estado: 0,
        estudiantes: [],
        reseñas: [],
      };

      actividadRepo.save.mockResolvedValue(actividad);

      const result = await service.crearActividad(actividad);

      expect(actividadRepo.save).toHaveBeenCalledWith({
        ...actividad,
        estado: 0,
      });
      expect(result).toEqual(actividad);
    });

    it('debería lanzar BadRequestException si título tiene menos de 15 caracteres', async () => {
      const actividad = new ActividadEntity();
      actividad.titulo = 'muy corto'; // 9 chars < 15
      actividad.fecha = '2025-01-01';
      actividad.cupoMaximo = 1;
      actividad.estado = 0;

      await expect(service.crearActividad(actividad)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si título tiene símbolos', async () => {
      const actividad: ActividadEntity = {
        titulo: 'Actividad #invalida!',
      } as ActividadEntity;

      await expect(service.crearActividad(actividad)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cambiarEstado', () => {
    it('debería cambiar estado correctamente para estado válido y actividad existente', async () => {
      const actividad: ActividadEntity = {
        id: 1,
        titulo: 'Actividad válida para cambiar estado',
        fecha: '2025-05-17',
        cupoMaximo: 5,
        estado: 0,
        estudiantes: [],
        reseñas: [],
      };

      actividadRepo.findOneBy.mockResolvedValue(actividad);
      actividadRepo.save.mockResolvedValue(actividad);


      const result = await service.cambiarEstado(1, 0);

      expect(actividadRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(actividadRepo.save).toHaveBeenCalledWith({
        ...actividad,
        estado: 0,
      });
      expect(result.estado).toBe(0);
    });

    it('debería lanzar NotFoundException si actividad no existe', async () => {
      actividadRepo.findOneBy.mockResolvedValue(undefined);

      await expect(service.cambiarEstado(99, 0)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar BadRequestException si estado inválido', async () => {
      actividadRepo.findOneBy.mockResolvedValue({} as ActividadEntity);

      await expect(service.cambiarEstado(1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException al cambiar a estado 1 si cupoMaximo inválido', async () => {
      const actividad = {
        id: 1,
        cupoMaximo: 0,
        estado: 0,
        titulo: 'Actividad',
        fecha: '2025-05-17',
      } as ActividadEntity;

      actividadRepo.findOneBy.mockResolvedValue(actividad);

      await expect(service.cambiarEstado(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException al cambiar a estado 1 explicando falta de implementación', async () => {
      const actividad = {
        id: 1,
        cupoMaximo: 10,
        estado: 0,
        titulo: 'Actividad',
        fecha: '2025-05-17',
      } as ActividadEntity;

      actividadRepo.findOneBy.mockResolvedValue(actividad);

      await expect(service.cambiarEstado(1, 1)).rejects.toThrow(
        'Para validar el 80% del cupo lleno es necesario contar inscritos (no implementado aquí)',
      );
    });

    it('debería lanzar BadRequestException al cambiar a estado 2 si cupoMaximo > 0', async () => {
      const actividad = {
        id: 1,
        cupoMaximo: 5,
        estado: 1,
        titulo: 'Actividad',
        fecha: '2025-05-17',
      } as ActividadEntity;

      actividadRepo.findOneBy.mockResolvedValue(actividad);

      await expect(service.cambiarEstado(1, 2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería permitir cambiar a estado 2 si cupoMaximo <= 0', async () => {
      const actividad = {
        id: 1,
        cupoMaximo: 0,
        estado: 1,
        titulo: 'Actividad',
        fecha: '2025-05-17',
      } as ActividadEntity;

      actividadRepo.findOneBy.mockResolvedValue(actividad);

      // Simulamos que save recibe el objeto con estado cambiado y lo retorna
      // Ahora
      actividadRepo.save.mockResolvedValue(actividad);

      const result = await service.cambiarEstado(1, 2);

      expect(result.estado).toBe(2);
    });
  });

  describe('findAllActividadesByDate', () => {
    it('debería retornar actividades según fecha', async () => {
      const fecha = '2025-05-17';
      const actividades = [
        { id: 1, fecha, titulo: 'Actividad 1' },
        { id: 2, fecha, titulo: 'Actividad 2' },
      ] as ActividadEntity[];

      actividadRepo.find.mockResolvedValue(actividades);

      const result = await service.findAllActividadesByDate(fecha);

      expect(actividadRepo.find).toHaveBeenCalledWith({ where: { fecha } });
      expect(result).toEqual(actividades);
    });
  });
});
