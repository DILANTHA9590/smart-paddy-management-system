import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.FARMER,
    description: 'Role name',
  })
  @IsEnum(UserRole)
  roleName!: UserRole;

  @ApiPropertyOptional({
    example: 'Farmer role with agriculture permissions',
    description: 'Role description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
