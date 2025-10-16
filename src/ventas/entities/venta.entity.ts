import { Cliente } from "src/clientes/entities/cliente.entity";
import { TiposVenta } from "src/common/enums/tipos-venta.enum";
import { Factura } from "src/facturas/entities/factura.entity";
import { ItemVenta } from "src/items-venta/entities/item-venta.entity";
import { MetodoPago } from "src/metodos-pago/entities/metodo-pago.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'VENTAS' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  descuento: number;

  @Column({ type: 'varchar', name: 'tipo_venta' })
  tipoVenta: TiposVenta;

  @Column({ type: 'varchar2', name: 'notas', nullable: true })
  notas: string | null;

  @ManyToOne(() => Usuario, usuario => usuario.ventas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Cliente, Cliente => Cliente.ventas)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => MetodoPago, metodoPago => metodoPago.ventas, { nullable: true })
  @JoinColumn({ name: 'tipo_pago_id' })
  metodoPago: MetodoPago | null;

  @OneToMany(() => ItemVenta, itemVenta => itemVenta.venta)
  ventaItems: ItemVenta[];

  @OneToOne(() => Factura, factura => factura.venta)
  factura: Factura;
}
