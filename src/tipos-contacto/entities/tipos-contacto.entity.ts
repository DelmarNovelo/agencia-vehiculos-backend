import { Contacto } from "src/contactos/entities/contacto.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'TIPOS_CONTACTO' })
export class TipoContacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  
  @OneToMany(() => Contacto, contacto => contacto.tipoContacto)
  contactos: Contacto[];
}
