import { Module } from '@nestjs/common';
import { FakeService } from './fake.service';
import { FakeController } from './fake.controller';

@Module({
  controllers: [FakeController],
  providers: [FakeService],
  imports: [],
  exports: [
    FakeService
  ]
})

export class FakeModule {}
