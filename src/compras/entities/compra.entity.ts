import { TiposVenta } from "src/common/enums/tipos-venta.enum";
import { CompraDoc } from "src/compra-docs/entities/compra-doc.entity";
import { ItemCompra } from "src/items-compra/entities/item-compra.entity";
import { MetodoPago } from "src/metodos-pago/entities/metodo-pago.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'COMPRAS' })
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  descuento: number;

  @Column({ type: 'varchar', name: 'tipo_compra' })
  tipoCompra: TiposVenta;

  @Column({ type: 'varchar2', name: 'notas', nullable: true })
  notas: string | null;

  @ManyToOne(() => MetodoPago, metodoPago => metodoPago.compras, { nullable: true })
  @JoinColumn({ name: 'tipo_pago_id' })
  metodoPago: MetodoPago | null;

  @ManyToOne(() => Proveedor, proveedor => proveedor.compras)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @OneToMany(() => ItemCompra, itemCompra => itemCompra.compra, { cascade: true })
  itemsCompra: ItemCompra[];

  @OneToOne(() => CompraDoc, compraDoc => compraDoc.compra)
  documento: CompraDoc;
}
