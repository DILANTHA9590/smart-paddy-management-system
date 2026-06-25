import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRandomValues } from 'crypto';
import * as argon2 from 'argon2';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { UuidParamDto } from 'src/common/dto/uuid-param';
import { exit } from 'process';
import { watch } from 'fs';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Role } from '../roles/entities/role.entity';
import { TokenPayload } from '../auth/interfaces/auth.interface';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';
import { AssignUserRoleDto } from './dto/assign-user_role.dto';
import { RedisService } from '../redis/redis.service';
import { OtpService } from '../otp/otp.service';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  //create  new user
  async create(createUserDto: CreateUserDto): Promise<ApiResponseDto<null>> {
    const { email, userName, password } = createUserDto;

    // 🔎 Check existing user (single DB query)
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { userName }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already taken');
      }
      if (existingUser.userName === userName) {
        throw new ConflictException('Username already taken');
      }
    }

    // 🔐 Get Pepper from .env
    const pepper = this.configService.getOrThrow<string>('PASSWORD_PEPPER');

    // 🔒 Hash password using Argon2id
    const hashedPassword = await argon2.hash(password + pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3,
      parallelism: 1,
    });

    // 👤 Create user
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isVerified: false, // OTP verify karanawanam false
    });

    await this.userRepository.save(newUser);
    await this.otpService.create(email);

    return {
      success: true,
      message: 'User created successfully',
      data: null,
    };
  }

  private generateFiveDigitNumber(): number {
    return Math.floor(100 + Math.random() * 900);
  }




  async resendOtp(dto: ResendOtpDto): Promise<ApiResponseDto<null>> {
    const { email } = dto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }

    await this.otpService.resendOtp(email);

    return {
      success: true,
      message: 'Otp resent sucessfully',
      data: null,
    };
  }

  // get all user and filter all users
  async getAllUsers(
    dto: SearchUsersDto,
  ): Promise<ApiResponseDto<PaginatedDto<User>>> {
    const { limit, search, page, status } = dto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.userName',
        'user.isVerified',
        'user.userStatus',
        'role.id',
        'role.roleName',
      ]);

    if (search) {
      query.andWhere(
        `user.firstName LIKE :search OR user.lastName LIKE :search 
OR user.email LIKE :search`,
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('user.userStatus = :status', { status: status });
    }

    query.take(limit);

    query.skip((page - 1) * limit);

    const [user, total] = await query.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'User created successfully',
      data: {
        items: user,
        totalPages,
        limit,
      },
    };
  }

  //  find user by id

  async findOne({ id }: UuidParamDto): Promise<ApiResponseDto<User>> {
    const existUser = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!existUser) throw new NotFoundException('No User Found');

    return {
      success: true,
      message: 'user data retrive succssfully',
      data: existUser,
    };
  }
  //update user

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<null>> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);

    await this.userRepository.save(updatedUser);

    return {
      success: true,
      message: 'User updated successfully',
      data: null,
    };
  }

  // remove user
  async remove(id: string): Promise<ApiResponseDto<null>> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingUser) throw new NotFoundException('No User Found');

    await this.userRepository.remove(existingUser);

    return {
      success: true,
      message: 'User deleted successfully',
      data: null,
    };
  }

  //Assign new role for users
  async assignUserRole(
    dto: AssignUserRoleDto,
    payload: JwtPayloadDto,
  ): Promise<ApiResponseDto<null>> {
    const { sub } = payload; // req user id

    const existingUser = await this.userRepository.findOne({
      where: {
        id: dto.userId,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const checkexitingRole = await this.roleRepository.findOne({
      where: {
        id: dto.roleId,
      },
    });

    if (!checkexitingRole) {
      throw new BadRequestException('Invalid role assignment');
    }

    const create = this.userRepository.create({
      id: existingUser.id,
      assignedRoleBy: sub,
      role: {
        id: dto.roleId,
      } as Role,
    });

    await this.userRepository.save(create);

    return {
      success: true,
      message: 'Role assigned successfully',
      data: null,
    };
  }

  async verifyUserOtp(dto: VerifyOtpDto):Promise<ApiResponseDto<null>> {
    const { email ,otp } = dto;

    const existingUser = await this.userRepository.findOne({
      where: {
        email: email
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (existingUser.isVerified) throw new BadRequestException('This user alredy verify');

     await this.otpService.validateOtp(email,otp)
     await this.userRepository.save({
      ...existingUser,isVerified:true
     })

     
       return {
      success: true,
      message: 'Role assigned successfully',
       data: null
    }
     }
  }
   
  


