/* eslint-disable prettier/prettier */

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { ReseñaEntity } from 'src/reseña/reseña.entity';
import { ActividadEntity } from 'src/actividad/actividad.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @OneToMany(() => ReseñaEntity, (reseña) => reseña.estudiante)
  reseñas: ReseñaEntity[];

  @ManyToMany(() => ActividadEntity, (actividad) => actividad.estudiantes)
  actividades: ActividadEntity[];
}
export class EstudianteEntity {}
