import { Compra } from "src/compras/entities/compra.entity";
import { ContactoProveedor } from "src/contactos-proveedor/entities/contacto-proveedor.entity";
import { Direccion } from "src/direcciones/entities/direccion.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'PROVEEDORES' })
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, name: 'razon_social' })
  razonSocial: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  nit: string | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Direccion, direccion => direccion.proveedor)
  direccion: Direccion;

  @OneToMany(() => ContactoProveedor, contactoProveedor => contactoProveedor.proveedor)
  contactosProveedor: ContactoProveedor[];

  @OneToMany(() => Compra, compra => compra.proveedor)
  compras: Compra[];
}
