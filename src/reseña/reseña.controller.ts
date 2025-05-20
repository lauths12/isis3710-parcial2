/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReseñaService } from './reseña.service';
import { ReseñaEntity } from './reseña.entity';
import { ReseñaDto } from '../reseña/reseña.dto/reseña.dto';

@Controller('resenias')
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService) {}

  @Post()
  async agregarReseña(@Body() reseñaDto: ReseñaDto): Promise<ReseñaEntity> {
    const reseña: ReseñaEntity = plainToInstance(ReseñaEntity, reseñaDto);
    return await this.reseñaService.agregarReseña(reseña);
  }
}
