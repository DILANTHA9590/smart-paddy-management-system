import { Test, TestingModule } from '@nestjs/testing';
import { FarmerAssociationController } from './farmer-association.controller';
import { FarmerAssociationService } from './farmer-association.service';

describe('FarmerAssociationController', () => {
  let controller: FarmerAssociationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmerAssociationController],
      providers: [FarmerAssociationService],
    }).compile();

    controller = module.get<FarmerAssociationController>(FarmerAssociationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
