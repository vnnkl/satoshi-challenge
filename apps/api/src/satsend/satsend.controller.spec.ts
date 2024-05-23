import { Test, TestingModule } from '@nestjs/testing';
import { SatsendController } from './satsend.controller';

describe('SatsendController', () => {
  let controller: SatsendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatsendController],
    }).compile();

    controller = module.get<SatsendController>(SatsendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
