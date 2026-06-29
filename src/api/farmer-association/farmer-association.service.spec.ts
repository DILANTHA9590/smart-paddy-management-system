import { Test, TestingModule } from '@nestjs/testing';
import { FarmerAssociationService } from './farmer-association.service';

describe('FarmerAssociationService', () => {
  let service: FarmerAssociationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmerAssociationService],
    }).compile();

    service = module.get<FarmerAssociationService>(FarmerAssociationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
