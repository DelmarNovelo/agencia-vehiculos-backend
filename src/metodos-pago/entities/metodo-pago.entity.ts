import { Compra } from "src/compras/entities/compra.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany } from "typeorm";

@Entity({ name: 'METODOS_PAGO' })
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Venta, venta => venta.metodoPago)
  ventas: Venta[];

  @OneToMany(() => Compra, compra => compra.metodoPago)
  compras: Compra[];
}
