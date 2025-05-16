/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActividadEntity } from 'src/actividad/actividad.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';

@Entity()

export class ReseñaEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    comentario: string;

    @Column()
    calificacion: number;

    @Column()
    fecha: string;

    @ManyToOne(() => ActividadEntity, actividad => actividad.reseñas)
    actividad: ActividadEntity;

    @ManyToOne(() => EstudianteEntity, estudiante => estudiante.reseñas)
    estudiante: EstudianteEntity;
}
