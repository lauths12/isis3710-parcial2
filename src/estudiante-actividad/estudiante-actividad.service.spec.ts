/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteActividadService } from './estudiante-actividad.service';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('EstudianteActividadService', () => {
  let service: EstudianteActividadService;
  let estudianteRepository: ReturnType<typeof mockRepository>;
  let actividadRepository: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteActividadService,
        { provide: 'EstudianteEntityRepository', useFactory: mockRepository },
        { provide: 'ActividadEntityRepository', useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<EstudianteActividadService>(EstudianteActividadService);
    estudianteRepository = module.get('EstudianteEntityRepository');
    actividadRepository = module.get('ActividadEntityRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addActividadEstudiante', () => {
    it('debería añadir una actividad al estudiante y guardar', async () => {
      const actividad = { id: 1, titulo: 'Actividad 1' } as ActividadEntity;
      const estudiante = { id: 1, actividades: [] } as unknown as EstudianteEntity;
      const estudianteGuardado = { ...estudiante, actividades: [actividad] };

      actividadRepository.findOne.mockResolvedValue(actividad);
      estudianteRepository.findOne.mockResolvedValue(estudiante);
      estudianteRepository.save.mockResolvedValue(estudianteGuardado);

      const result = await service.addActividadEstudiante(estudiante.id, actividad.id);

      expect(actividadRepository.findOne).toHaveBeenCalledWith({ where: { id: actividad.id } });
      expect(estudianteRepository.findOne).toHaveBeenCalledWith({ where: { id: estudiante.id }, relations: ['actividades'] });
      expect(estudianteRepository.save).toHaveBeenCalledWith(estudianteGuardado);
      expect(result).toEqual(estudianteGuardado);
    });

    it('debería lanzar NotFoundException si la actividad no existe', async () => {
      actividadRepository.findOne.mockResolvedValue(undefined);

      await expect(service.addActividadEstudiante(1, 99)).rejects.toThrow(NotFoundException);
      expect(actividadRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
    });

    it('debería lanzar NotFoundException si el estudiante no existe', async () => {
      const actividad = { id: 1 } as ActividadEntity;
      actividadRepository.findOne.mockResolvedValue(actividad);
      estudianteRepository.findOne.mockResolvedValue(undefined);

      await expect(service.addActividadEstudiante(99, actividad.id)).rejects.toThrow(NotFoundException);
      expect(estudianteRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 }, relations: ['actividades'] });
    });
  });
});
