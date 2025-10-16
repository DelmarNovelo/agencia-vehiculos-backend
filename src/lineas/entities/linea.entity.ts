import { Marca } from "src/marcas/entities/marca.entity";
import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'LINEAS' })
export class Linea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  
  @ManyToOne(() => Marca, marca => marca.lineas)
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;

  // @ManyToMany(() => Modelo, modelo => modelo.lineas)
  // @JoinTable({
  //   name: 'lineas_modelos',
  //   joinColumn: {
  //     name: 'linea_id', referencedColumnName: 'id'
  //   },
  //   inverseJoinColumn: { name: 'modelo_id', referencedColumnName: 'id' }
  // })
  // modelos: Modelo[];

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.linea)
  vehiculos: Vehiculo[];
}
