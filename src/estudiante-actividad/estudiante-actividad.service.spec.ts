/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteActividadService } from './estudiante-actividad.service';

describe('EstudianteActividadService', () => {
  let service: EstudianteActividadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstudianteActividadService],
    }).compile();

    service = module.get<EstudianteActividadService>(EstudianteActividadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
