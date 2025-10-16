import { Empresa } from "src/empresas/entities/empresa.entity";
import { Persona } from "src/personas/entities/persona.entity";
import { TipoContacto } from "src/tipos-contacto/entities/tipos-contacto.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'CONTACTOS' })
export class Contacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, name: 'valor_contacto' })
  valorContacto: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => TipoContacto, tipoContacto => tipoContacto.contactos)
  @JoinColumn({ name: 'tipo_contacto_id' })
  tipoContacto: TipoContacto;

  @ManyToOne(() => Persona, persona => persona.contactos, { nullable: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona | null;

  @ManyToOne(() => Empresa, empresa => empresa.contactos, { nullable: true })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa | null;
}
