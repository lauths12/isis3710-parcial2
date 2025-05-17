/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class EstudianteDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly correo: string;

    @IsString()
    @IsNotEmpty()
    readonly programa: string;

    @IsString()
    @IsNotEmpty()
    readonly semestre: number;
    
}
