/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from 'class-validator';

export class ActividadDto {
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsString()
  @IsNotEmpty()
  readonly cupoMaximo: number;

  @IsString()
  @IsNotEmpty()
  readonly estado: string;
}
