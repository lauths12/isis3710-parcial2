/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";


export class ReseñaDto {
    @IsString()
    @IsNotEmpty()
    readonly comentario: string;

    @IsString()
    @IsNotEmpty()
    readonly calificacion: number;

    @IsString()
    @IsNotEmpty()
    readonly fecha: string;


}
