/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class EstudianteDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsNumber()
    @IsNotEmpty()
    readonly cedula: number;

    @IsString()
    @IsNotEmpty()
    readonly correo: string;

    @IsString()
    @IsNotEmpty()
    readonly programa: string;

    @IsNumber()
    @IsNotEmpty()
    readonly semestre: number;
    
}
