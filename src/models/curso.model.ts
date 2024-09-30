import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn, JoinTable, 
         CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Profesor } from "./profesor.model";
import { Alumno } from "./alumno.model";

@Entity('cursos')
export class Curso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{nullable:true})
    nombre: string;

    @Column('text',{nullable:true})
    descripto: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => Profesor,profesor => profesor.cursos)
    @JoinColumn({name:'idProfesor'})
    profesor: Profesor;

    @ManyToMany(() => Alumno)
    @JoinTable({
        name: 'inscripto',
        joinColumn: { name: 'idCurso', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idAlumno', referencedColumnName: 'id' }
    })
    alumnos: Alumno[];
    
}
