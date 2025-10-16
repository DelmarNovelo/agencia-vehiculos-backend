import { Municipio } from "src/municipios/entities/municipio.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'DEPARTAMENTOS' })
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Municipio, municipio => municipio.departamento, { cascade: true })
  municipios: Municipio[];
}
