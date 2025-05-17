/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { ActividadService } from './actividad.service';

@Controller('actividad')
export class ActividadController {
    constructor(private readonly actividadService: ActividadService) {}
}
