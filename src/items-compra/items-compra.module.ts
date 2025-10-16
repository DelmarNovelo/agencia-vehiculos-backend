import { Module } from '@nestjs/common';
import { ItemsCompraService } from './items-compra.service';
import { ItemsCompraController } from './items-compra.controller';

@Module({
  controllers: [ItemsCompraController],
  providers: [ItemsCompraService],
})
export class ItemsCompraModule {}
