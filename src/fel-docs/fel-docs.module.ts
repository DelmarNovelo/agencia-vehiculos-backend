import { Module } from '@nestjs/common';
import { FelDocsService } from './fel-docs.service';
import { FelDocsController } from './fel-docs.controller';

@Module({
  controllers: [FelDocsController],
  providers: [FelDocsService],
})
export class FelDocsModule {}
