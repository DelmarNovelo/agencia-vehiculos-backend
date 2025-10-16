import { Contacto } from "src/contactos/entities/contacto.entity";
import { Direccion } from "src/direcciones/entities/direccion.entity";
import { Empresa } from "src/empresas/entities/empresa.entity";
import { Persona } from "src/personas/entities/persona.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'SUCURSALES' })
export class Sucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  // @ManyToOne(() => Empresa, empresa => empresa.sucursales)
  // @JoinColumn({ name: 'empresa_id' })
  // empresa: Empresa;
  
  // @OneToOne(() => Direccion, direccion => direccion.sucursal)
  // direccion: Direccion;

  // @OneToMany(() => Persona, persona => persona.sucursal)
  // personas: Persona[];

  // @OneToMany(() => Contacto, contacto => contacto.sucursal)
  // contactos: Contacto[];
}
