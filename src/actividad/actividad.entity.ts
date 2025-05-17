/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReseñaEntity } from "../reseña/reseña.entity";
import { EstudianteEntity } from "../estudiante/estudiante.entity";

@Entity()
export class ActividadEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    titulo: string;

    @Column()
    fecha: string;

    @Column()
    cupoMaximo: number;

    @Column()
    estado: number;

    @ManyToMany(() => EstudianteEntity, estudiante => estudiante.actividades)
    estudiantes: EstudianteEntity[];

    @OneToMany(()=> ReseñaEntity, reseña => reseña.actividad)
    reseñas: ReseñaEntity[];
}
