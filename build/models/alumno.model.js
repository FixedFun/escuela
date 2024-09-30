"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alumno = void 0;
const typeorm_1 = require("typeorm");
const curso_model_1 = require("./curso.model");
let Alumno = class Alumno {
};
exports.Alumno = Alumno;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Alumno.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Alumno.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Alumno.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Alumno.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Alumno.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Alumno.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Alumno.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => curso_model_1.Curso),
    (0, typeorm_1.JoinTable)({
        name: 'inscripto',
        joinColumn: { name: 'idAlumno', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idCurso', referencedColumnName: 'id' }
    }),
    __metadata("design:type", Array)
], Alumno.prototype, "cursos", void 0);
exports.Alumno = Alumno = __decorate([
    (0, typeorm_1.Entity)('alumnos')
], Alumno);
