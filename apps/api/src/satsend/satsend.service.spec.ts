import { Test, TestingModule } from '@nestjs/testing';
import { SatsendService } from './satsend.service';

describe('SatsendService', () => {
  let service: SatsendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SatsendService],
    }).compile();

    service = module.get<SatsendService>(SatsendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
