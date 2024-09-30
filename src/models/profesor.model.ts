import { Entity, PrimaryGeneratedColumn, Column, OneToMany, 
         CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Curso } from "./curso.model";

@Entity('profesores')
export class Profesor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' , default:  0 })
    dni: number;

    @Column('text',{nullable:true})
    nombre: string;

    @Column('text',{nullable:true})
    apellido: string;

    @Column('text',{nullable:true})
    correo: string;

    @Column('text',{nullable:true})
    rubro: string;

    @Column({ type: 'float' , default:  0 })
    numtel: number;
    
    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @OneToMany(() => Curso, (curso) => curso.profesor)
    cursos: Curso[];
}
