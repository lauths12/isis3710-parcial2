/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ReseñaService } from './reseña.service';
import { ReseñaEntity } from './reseña.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { BadRequestException } from '@nestjs/common';

const mockRepository = () => ({
  save: jest.fn(),
});

describe('ReseñaService', () => {
  let service: ReseñaService;
  let reseñaRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReseñaService,
        { provide: 'ReseñaEntityRepository', useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<ReseñaService>(ReseñaService);
    reseñaRepo = module.get('ReseñaEntityRepository');
  });

  // Helpers para crear instancias tipadas
  function createEstudiante(id: number): EstudianteEntity {
    const e = new EstudianteEntity();
    e.id = id;
    e.nombre = 'Test Estudiante';
    e.correo = 'test@mail.com';
    e.programa = 'TestProg';
    e.semestre = 1;
    e.actividades = [];
    e.reseñas = [];
    return e;
  }

  function createActividad(id: number, estado: number, inscritos: EstudianteEntity[]): ActividadEntity {
    const a = new ActividadEntity();
    a.id = id;
    a.titulo = 'Test Actividad';
    a.fecha = '2025-05-17';
    a.cupoMaximo = inscritos.length;
    a.estado = estado;
    a.estudiantes = inscritos;
    a.reseñas = [];
    return a;
  }

  function createReseña(id: number, actividad: ActividadEntity, estudiante: EstudianteEntity): ReseñaEntity {
    const r = new ReseñaEntity();
    r.id = id;
    r.comentario = 'Excelente';
    r.calificacion = 5;
    r.fecha = '2025-05-18';
    r.actividad = actividad;
    r.estudiante = estudiante;
    return r;
  }

  it('guarda la reseña si actividad finalizada y estudiante inscrito', async () => {
    const est = createEstudiante(1);
    const act = createActividad(10, 2, [est]);
    const reseña = createReseña(100, act, est);

    reseñaRepo.save.mockResolvedValue(reseña);

    const result = await service.agregarReseña(reseña);

    expect(reseñaRepo.save).toHaveBeenCalledWith(reseña);
    expect(result).toEqual(reseña);
  });

  it('lanza BadRequestException si la actividad no está finalizada', async () => {
    const est = createEstudiante(1);
    const act = createActividad(10, 1, [est]); 
    const reseña = createReseña(101, act, est);

    await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    expect(reseñaRepo.save).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si no hay lista de estudiantes o está vacía', async () => {
    const est = createEstudiante(1);
    const act = createActividad(11, 2, []); 
    const reseña = createReseña(102, act, est);

    await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    expect(reseñaRepo.save).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si el estudiante no estuvo inscrito', async () => {
    const est = createEstudiante(1);
    const otro = createEstudiante(2);
    const act = createActividad(12, 2, [otro]); 
    const reseña = createReseña(103, act, est);

    await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    expect(reseñaRepo.save).not.toHaveBeenCalled();
  });
});
