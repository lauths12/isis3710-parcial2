/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { ReseñaService } from './reseña.service';

@Controller('reseña')
export class ReseñaController {
    constructor(private readonly reseñaService: ReseñaService) {}
}
