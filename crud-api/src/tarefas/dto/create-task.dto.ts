import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsEnum(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';
}
