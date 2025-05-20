/* eslint-disable prettier/prettier*/
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseñaModule } from './reseña/reseña.module';
import { EstudianteEntity } from './estudiante/estudiante.entity';
import { ActividadEntity } from './actividad/actividad.entity';
import { ReseñaEntity } from './reseña/reseña.entity';
import { EstudianteActividadModule } from './estudiante-actividad/estudiante-actividad.module';

@Module({
  imports: [
    EstudianteEntity,
    ActividadEntity,
    ReseñaEntity,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [EstudianteEntity, ActividadEntity, ReseñaEntity],
      dropSchema: true,
      synchronize: true,
    }),
    EstudianteModule,
    ActividadModule,
    ReseñaModule,
    EstudianteActividadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
