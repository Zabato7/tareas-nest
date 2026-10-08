import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** Todos los campos son opcionales: solo se cambian los que se envíen. */
export class ActualizarTareaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}
