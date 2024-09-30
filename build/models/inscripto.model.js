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
exports.Inscripto = void 0;
const typeorm_1 = require("typeorm");
const alumno_model_1 = require("./alumno.model");
const curso_model_1 = require("./curso.model");
let Inscripto = class Inscripto {
};
exports.Inscripto = Inscripto;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Inscripto.prototype, "idAlumno", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Inscripto.prototype, "idCurso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Inscripto.prototype, "nota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE' }),
    __metadata("design:type", Date)
], Inscripto.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => alumno_model_1.Alumno, (alumno) => alumno.cursos),
    (0, typeorm_1.JoinColumn)({ name: 'idAlumno' }),
    __metadata("design:type", alumno_model_1.Alumno)
], Inscripto.prototype, "alumno", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => curso_model_1.Curso, (curso) => curso.alumnos),
    (0, typeorm_1.JoinColumn)({ name: 'idCurso' }),
    __metadata("design:type", curso_model_1.Curso)
], Inscripto.prototype, "curso", void 0);
exports.Inscripto = Inscripto = __decorate([
    (0, typeorm_1.Entity)('inscripto')
], Inscripto);
