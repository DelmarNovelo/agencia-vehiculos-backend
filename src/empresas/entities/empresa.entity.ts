import { Contacto } from "src/contactos/entities/contacto.entity";
import { Direccion } from "src/direcciones/entities/direccion.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'EMPRESAS' })
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, name: 'razon_social' })
  razonSocial: string;

  @Column({ length: 15 })
  nit: string;

  @OneToOne(() => Direccion, direccion => direccion.empresa)
  direccion: Direccion;

  @OneToMany(() => Contacto, contacto => contacto.empresa)
  contactos: Contacto[];
}
