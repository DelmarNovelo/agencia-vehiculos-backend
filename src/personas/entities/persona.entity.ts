import { Cliente } from "src/clientes/entities/cliente.entity";
import { ContactoProveedor } from "src/contactos-proveedor/entities/contacto-proveedor.entity";
import { Contacto } from "src/contactos/entities/contacto.entity";
import { Direccion } from "src/direcciones/entities/direccion.entity";
import { Empleado } from "src/empleados/entities/empleado.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'PERSONAS' })
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 50 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dpi: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  nit: string | null;

  @Column({ type: 'number', precision: 1, default: 1 })
  activo: boolean;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Usuario, usuario => usuario.persona)
  usuario: Usuario;

  @OneToMany(() => Contacto, contacto => contacto.persona)
  contactos: Contacto[];

  @OneToOne(() => Empleado, empleado => empleado.persona, { cascade: true })
  empleado: Empleado;

  @OneToOne(() => Cliente, cliente => cliente.persona)
  cliente: Cliente;

  @OneToOne(() => Direccion, direccion => direccion.persona)
  direccion: Direccion;

  @OneToOne(() => ContactoProveedor, contactoProveedor => contactoProveedor.persona)
  contactoProveedor: ContactoProveedor;
}
