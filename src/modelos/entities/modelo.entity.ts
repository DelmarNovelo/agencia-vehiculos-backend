import { Linea } from "src/lineas/entities/linea.entity";
import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'MODELOS' })
export class Modelo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.modelo)
  vehiculos: Vehiculo[];
}
