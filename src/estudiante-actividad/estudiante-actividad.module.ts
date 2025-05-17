/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { EstudianteService } from 'src/estudiante/estudiante.service';

@Module({
   imports: [TypeOrmModule.forFeature([EstudianteEntity])],
 providers: [EstudianteService],
})
export class EstudianteModule {}
