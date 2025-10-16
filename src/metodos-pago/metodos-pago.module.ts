import { Module } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { MetodosPagoController } from './metodos-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';

@Module({
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService],
  imports: [
    TypeOrmModule.forFeature([
      MetodoPago,
    ])
  ]
})
export class MetodosPagoModule {}
