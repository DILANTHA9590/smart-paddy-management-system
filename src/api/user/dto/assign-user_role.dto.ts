import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignUserRoleDto {
  @ApiProperty({
    description: 'UUID of the user to assign the role to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId!: string;

  @ApiProperty({
    description: 'UUID of the role to assign to the user',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  @IsNotEmpty({ message: 'Role ID is required' })
  @IsUUID('4', { message: 'Role ID must be a valid UUID' })
  roleId!: string;
}