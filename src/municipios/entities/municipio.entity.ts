import { Departamento } from "src/departamentos/entities/departamento.entity";
import { Direccion } from "src/direcciones/entities/direccion.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'MUNICIPIOS' })
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Departamento, departamento => departamento.municipios)
  @JoinColumn({ name: 'departamento_id' })
  departamento: Departamento;

  @OneToMany(() => Direccion, direccion => direccion.municipio)
  direcciones: Direccion[];
}
