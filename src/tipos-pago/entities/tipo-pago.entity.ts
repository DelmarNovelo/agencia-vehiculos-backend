import { Venta } from "src/ventas/entities/venta.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'TIPOS_PAGO' })
export class TipoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // @OneToMany(() => Venta, venta => venta.tipoPago)
  // ventas: Venta[];
}