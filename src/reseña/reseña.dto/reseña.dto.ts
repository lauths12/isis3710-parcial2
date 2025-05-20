/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class ReseñaDto {
    @IsString()
    @IsNotEmpty()
    readonly comentario: string;

    @IsNumber()
    @IsNotEmpty()
    readonly calificacion: number;

    @IsString()
    @IsNotEmpty()
    readonly fecha: string;


}
