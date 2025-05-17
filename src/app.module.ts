/* eslint-disable prettier/prettier*/
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ReseñaModule } from './reseña/reseña.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [EstudianteModule, ActividadModule, ReseñaModule],
      dropSchema: true,
      synchronize: true,
    }),
    EstudianteModule,
    ActividadModule,
    ReseñaModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
