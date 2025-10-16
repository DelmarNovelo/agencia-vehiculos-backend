import { Module } from '@nestjs/common';
import { TiposPagoService } from './tipos-pago.service';
import { TiposPagoController } from './tipos-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPago } from './entities/tipo-pago.entity';

@Module({
  controllers: [TiposPagoController],
  providers: [TiposPagoService],
  imports: [
    TypeOrmModule.forFeature([
      TipoPago
    ])
  ],
})
export class TiposPagoModule {}
