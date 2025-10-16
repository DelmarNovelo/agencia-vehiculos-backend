import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombustiblesService } from './combustibles.service';
import { CombustiblesController } from './combustibles.controller';
import { Combustible } from './entities/combustible.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combustible])],
  controllers: [CombustiblesController],
  providers: [CombustiblesService],
})
export class CombustiblesModule {}
