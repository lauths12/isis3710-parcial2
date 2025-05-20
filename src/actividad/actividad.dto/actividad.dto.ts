/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActividadDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsNumber()
  @IsNotEmpty()
  readonly cupoMaximo: number;

  @IsNumber()
  @IsNotEmpty()
  readonly estado: number;
}
