import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFarmerAssociationDto } from './dto/update-farmer-association.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmersAssociation } from './entities/farmer-association.entity';
import { Repository } from 'typeorm';
import { Farmer } from '../farmers/entities/farmer.entity';
import { CreateFarmersAssociationDto } from './dto/create-farmer-association.dto';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';
import { ApiResponseDto } from 'src/common/dto/api-respose-dto';

@Injectable()
export class FarmerAssociationService {
   constructor(
  @InjectRepository(FarmersAssociation) private readonly famerAssociationRepository: Repository<FarmersAssociation>,
    @InjectRepository(Farmer) private readonly famerRepository: Repository<Farmer>
   ){}
 async  create(dto: CreateFarmersAssociationDto, user:JwtPayloadDto):Promise<ApiResponseDto<null>> {

const  isExisting= await this.famerAssociationRepository.createQueryBuilder('farmerAssociation')
 .where('farmerAssociation.name =:name',{name:dto.name}).getOne()

 
if (isExisting) {
    throw new ConflictException('This farmer association already exists.');
  }

const associationCode =await this.generateAssociationCode()


 await this.famerAssociationRepository.save({
  ...dto,associationCode,createdBy:user.sub, 
 })



 return{
    success: true,
    message: 'Farmer updated successfully',
    data:null,
 }

  }

 async  generateAssociationCode():Promise<string>{ //genarate  association code
  const associationNumber = await this.famerAssociationRepository.findOne({
    where:{},
    order:{createdAt:"DESC"},
    lock:{mode:'pessimistic_write'}
  })
 
  let nextNumber:Number=100
  let Prefix:string="FA"

if(associationNumber && associationNumber.associationCode){
  nextNumber= Number(associationNumber.associationCode.replace(/\D/g, '')) + 1
 }
 return `${Prefix}${String(nextNumber).padStart(4, "0")}`; 
}


async update(
  id:string,
  dto: UpdateFarmerAssociationDto,
  user: JwtPayloadDto,
): Promise<ApiResponseDto<null>> {

  const association = await this.famerAssociationRepository.findOne({
    where: { id },
  });

  if (!association) {
    throw new NotFoundException('Farmers association not found.');
  }

  if (dto.name && dto.name !== association.name) {
    const exists = await this.famerAssociationRepository.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException(
        'This farmer association already exists.',
      );
    }
  }

  await this.famerAssociationRepository.update(id, {
    ...dto,
    updatedBy: user.sub,
  });

  return {
    success: true,
    message: 'Farmers association updated successfully.',
    data: null,
  };

}


async remove(id: string): Promise<ApiResponseDto<null>> {
  const association = await this.famerAssociationRepository.findOne({
    where: { id },
  });

  if (!association) {
    throw new NotFoundException('Farmers association not found.');
  }

  await this.famerAssociationRepository.remove(association);

  return {
    success: true,
    message: 'Farmers association deleted successfully.',
    data: null,
  };
}

 


 

  findAll() {
    return `This action returns all farmerAssociation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} farmerAssociation`;
  }



}
