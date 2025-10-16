import { Module } from '@nestjs/common';
import { CompraDocsService } from './compra-docs.service';
import { CompraDocsController } from './compra-docs.controller';

@Module({
  controllers: [CompraDocsController],
  providers: [CompraDocsService],
})
export class CompraDocsModule {}
