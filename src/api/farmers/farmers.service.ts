import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Farmer } from './entities/farmer.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../roles/role.enum';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';
import { SearchFarmerDto } from './dto/search-farmer.dto';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CreateFarmerFullDto } from './dto/create-farmer-full.dto';
import { FarmersAssociationMember } from '../farmer-association/entities/farmers-association-member.entity';
import { FarmersAssociation } from '../farmer-association/entities/farmer-association.entity';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
    @InjectRepository(Role) private readonly RoleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}
  async create(
    dto: CreateFarmerDto,
    id: string,
  ): Promise<ApiResponseDto<null>> {
    const { userId } = dto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.RoleRepository.findOne({
      where: {
        roleName: UserRole.FARMER,
      },
    });
    if (!role) {
      throw new InternalServerErrorException(
        'Farmer role is not configured. Please contact the system administrator.',
      );
    }
    const farmer = this.farmerRepository.create({
      ...dto,
      createdBy: id,
      user: { id: userId } as User,
    });
    await this.userRepository.save(farmer);
    await this.userRepository.save({ ...user, role: { id: role.id } });

    return {
      success: true,
      message: 'User created successfully',
      data: null,
    };
  }

  async adminCreateWithTransaction(
    dto: CreateFarmerFullDto,
    creatorId: string,
  ): Promise<ApiResponseDto<null>> {
    const { 
      firstName, lastName, userName, email, password, roleId,
      nic, phoneNumber, address, district, province, village, dateOfBirth, gender,
      associationId 
    } = dto;

    // 🔎 Check existing user
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { userName }],
    });

    if (existingUser) {
      if (existingUser.email === email) throw new ConflictException('Email already taken');
      if (existingUser.userName === userName) throw new ConflictException('Username already taken');
    }

    // 🔎 Check existing farmer NIC
    const existingFarmer = await this.farmerRepository.findOne({ where: { nic } });
    if (existingFarmer) throw new ConflictException('NIC already exists');

    // 🔐 Hash password
    const pepper = this.configService.getOrThrow<string>('PASSWORD_PEPPER');
    const hashedPassword = await argon2.hash(password + pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Start Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create User
      const user = queryRunner.manager.create(User, {
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
        isVerified: false,
        role: { id: roleId } as Role,
      });
      await queryRunner.manager.save(user);

      // 2. Create Farmer Profile
      const farmer = queryRunner.manager.create(Farmer, {
        nic,
        phoneNumber,
        address,
        district,
        province,
        village,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        createdBy: creatorId,
        user: user,
      });
      await queryRunner.manager.save(farmer);

      // 3. Create Association Membership (If provided)
      if (associationId) {
        // Validate association exists
        const association = await queryRunner.manager.findOne(FarmersAssociation, {
          where: { id: associationId }
        });
        if (!association) throw new NotFoundException('Farmers Association not found');

        const membership = queryRunner.manager.create(FarmersAssociationMember, {
          farmer: farmer,
          association: association,
        });
        await queryRunner.manager.save(membership);
      }

      await queryRunner.commitTransaction();

      // Trigger OTP creation outside of the transaction block
      await this.otpService.create(email);

      return {
        success: true,
        message: 'Farmer created successfully',
        data: null,
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    dto: SearchFarmerDto,
  ): Promise<ApiResponseDto<PaginatedDto<Farmer>>> {
    const { search, province, district, village, gender, page, limit } = dto;

    const query = this.farmerRepository
      .createQueryBuilder('farmer')
      .leftJoinAndSelect('farmer.user', 'user')
      .select([
        'farmer.id',
        'farmer.nic',
        'farmer.phoneNumber',
        'farmer.district',
        'farmer.province',
        'farmer.village',
        'farmer.gender',
        'farmer.createdAt',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.isVerified',
      ]);

    if (search) {
      query.andWhere(
        `(farmer.phoneNumber LIKE :search
        OR farmer.nic LIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (province) {
      query.andWhere('farmer.province = :province', {
        province,
      });
    }

    if (district) {
      query.andWhere('farmer.district = :district', {
        district,
      });
    }

    if (village) {
      query.andWhere('farmer.village = :village', {
        village,
      });
    }

    if (gender) {
      query.andWhere('farmer.gender = :gender', {
        gender,
      });
    }

    query.take(limit);
    query.skip((page - 1) * limit);

    const [farmers, total] = await query.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Farmers retrieved successfully',
      data: {
        items: farmers,
        totalPages,
        limit,
      },
    };
  }
  async findOne(id: string): Promise<ApiResponseDto<Farmer>> {
    const farmer = await this.farmerRepository
      .createQueryBuilder('farmer')
      .leftJoinAndSelect('farmer.user', 'user')
      .select([
        // Farmer
        'farmer.id',
        'farmer.nic',
        'farmer.phoneNumber',
        'farmer.address',
        'farmer.district',
        'farmer.province',
        'farmer.village',
        'farmer.dateOfBirth',
        'farmer.gender',
        'farmer.createdAt',

        // user
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.userName',
        'user.isVerified',
        'user.userStatus',
      ])
      .where('farmer.id = :id', { id })
      .getOne();

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    return {
      success: true,
      message: 'Farmer retrieved successfully',
      data: farmer,
    };
  }

  async update(
    id: string,
    dto: UpdateFarmerDto,
    user: JwtPayloadDto,
  ): Promise<ApiResponseDto<Farmer>> {
    const farmer = await this.farmerRepository.findOne({
      where: { id },
    });

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    await this.farmerRepository.save({
      ...farmer,
      ...dto,
      updatedAt: user.sub,
    });

    const updatedFarmer = await this.farmerRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    return {
      success: true,
      message: 'Farmer updated successfully',
      data: updatedFarmer!,
    };
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    const farmer = await this.farmerRepository.findOne({
      where: { id },
    });

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    await this.farmerRepository.remove(farmer);

    return {
      success: true,
      message: 'Farmer deleted successfully',
      data: null,
    };
  }

  async generatePdfReport() {}

  async generateCsvReport() {}

  async generateExcelReport() {}
}
