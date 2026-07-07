import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateFarmerAssociationDto } from './dto/update-farmer-association.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmersAssociation } from './entities/farmer-association.entity';
import { Repository } from 'typeorm';
import { Farmer } from '../farmers/entities/farmer.entity';
import { CreateFarmersAssociationDto } from './dto/create-farmer-association.dto';
import { JwtPayloadDto } from '../auth/dto/jwtPayload';

@Injectable()
export class FarmerAssociationService {
   constructor(
  @InjectRepository(FarmersAssociation) private readonly famerAssociationRepository: Repository<FarmersAssociation>,
    @InjectRepository(Farmer) private readonly famerRepository: Repository<Farmer>
   ){}
 async  create(dto: CreateFarmersAssociationDto, user:JwtPayloadDto) {

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

 


 

  findAll() {
    return `This action returns all farmerAssociation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} farmerAssociation`;
  }

  update(id: number, updateFarmerAssociationDto: UpdateFarmerAssociationDto) {
    return `This action updates a #${id} farmerAssociation`;
  }

  remove(id: number) {
    return `This action removes a #${id} farmerAssociation`;
  }
}
