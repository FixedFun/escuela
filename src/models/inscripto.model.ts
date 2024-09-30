import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { Alumno } from './alumno.model';
import { Curso } from './curso.model';

@Entity('inscripto')
export class Inscripto {
    @PrimaryColumn({ type: 'float' , default:  0 })
    public idAlumno: number;

    @PrimaryColumn({ type: 'float' , default:  0 })
    public idCurso: number;

    @Column({ type: 'float' , default:  0 })
    public nota: number; 

    @Column({ type: 'date', default: () => 'CURRENT_DATE' }) 
    public fecha: Date;

    @ManyToOne(() => Alumno, (alumno) => alumno.cursos)
    @JoinColumn({ name: 'idAlumno' })
    public alumno: Alumno;

    @ManyToOne(() => Curso, (curso) => curso.alumnos)
    @JoinColumn({ name: 'idCurso' })
    public curso: Curso;
}
