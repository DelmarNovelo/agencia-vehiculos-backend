import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'TRANSMISIONES' })
export class Transmision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.transmision)
  vehiculos: Vehiculo[];
}
