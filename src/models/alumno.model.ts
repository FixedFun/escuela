import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
         UpdateDateColumn, ManyToMany, JoinTable  } from "typeorm";
import { Curso } from "./curso.model";

@Entity('alumnos')
export class Alumno {
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
    
    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToMany(() => Curso)
    @JoinTable({
        name: 'inscripto',
        joinColumn: { name: 'idAlumno', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idCurso', referencedColumnName: 'id' }
    })
    cursos: Curso[];
}
