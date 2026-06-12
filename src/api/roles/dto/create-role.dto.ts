import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/role.enum';

export class CreateRoleDto {
  @IsEnum(UserRole)
  roleName!: UserRole;

  @IsOptional()
  @IsString()
  description?: string;
}