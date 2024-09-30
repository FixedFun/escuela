"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quitar = exports.modificar = exports.insertar = exports.consultarUno = exports.consultarTodos = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const curso_model_1 = require("../models/curso.model");
const profesor_model_1 = require("../models/profesor.model");
const inscripto_model_1 = require("../models/inscripto.model");
var cursos;
const validar = () => [
    (0, express_validator_1.check)("nombre")
        .notEmpty()
        .withMessage("Se debe nombrar el curso.")
        .isLength({ min: 3 })
        .withMessage("Los cursos llevan al menos 3 letras."),
    (0, express_validator_1.check)("descripto")
        .notEmpty()
        .withMessage("Se requiere una descripción.")
        .isLength({ min: 3 })
        .withMessage("Las descripciones necesitan al menos 3 letras."),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render("creaCursos", {
                pagina: "Añadir curso.",
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        cursos = yield cursoRepository.find({
            relations: ["profesor"],
        });
        res.render("listarCursos", {
            pagina: "Cursos",
            cursos,
        });
        console.log(cursos);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error("Error de código.");
    }
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        const curso = yield cursoRepository.findOne({
            where: { id: idNumber },
        });
        if (curso) {
            return curso;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        else {
            throw new Error("Error.");
        }
    }
});
exports.consultarUno = consultarUno;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesor_model_1.Profesor);
        const profesores = yield profesorRepository.find();
        return res.render("creaCursos", {
            pagina: "Añadir curso",
            profesores,
            cursos,
        });
    }
    const { nombre, descripto, idProfesor } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const profesorRepository = transactionalEntityManager.getRepository(profesor_model_1.Profesor);
            const cursoRepository = transactionalEntityManager.getRepository(curso_model_1.Curso);
            const existeProfesor = yield profesorRepository.findOne({
                where: { id: Number(idProfesor) },
            });
            if (!existeProfesor) {
                throw new Error("No hay curso");
            }
            const existeCurso = yield cursoRepository.findOne({
                where: [{ nombre }, { descripto }],
            });
            if (existeCurso) {
                throw new Error("El curso ya existe.");
            }
            const nuevoCurso = cursoRepository.create({
                nombre,
                descripto,
                profesor: existeProfesor,
            });
            yield cursoRepository.save(nuevoCurso);
        }));
        res.redirect("/cursos/listarCursos");
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, descripto, idProfesor } = req.body;
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        const curso = yield cursoRepository.findOne({
            where: { id: parseInt(id) },
        });
        if (!curso) {
            return res.status(404).json({ mensaje: "El curso no es válido." });
        }
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesor_model_1.Profesor);
        const profesor = yield profesorRepository.findOne({
            where: { id: idProfesor },
        });
        if (!profesor) {
            return res.status(400).json({ mensaje: "El curso no es válido." });
        }
        cursoRepository.merge(curso, { nombre, descripto, profesor });
        yield cursoRepository.save(curso);
        return res.redirect("/cursos/listarCursos");
    }
    catch (error) {
        console.error("Error de modificación.", error);
        return res.status(500).send("Error del servidor.");
    }
});
exports.modificar = modificar;
const quitar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const { id } = req.params;
    console.log(`ID Curso: ${id}`);
    if (!id) {
        return res.status(400).json({ mensaje: "Faltan datos." });
    }
    try {
        console.log(`Código: ${id} `);
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscriptoRepository = transactionalEntityManager.getRepository(inscripto_model_1.Inscripto);
            const cursoRepository = transactionalEntityManager.getRepository(curso_model_1.Curso);
            const numAlumnos = yield inscriptoRepository.count({
                where: { curso: { id: Number(id) } },
            });
            console.log(`Alumnos inscriptos: ${numAlumnos}`);
            if (numAlumnos > 0) {
                throw new Error("Hay curso, no se puede quitar.");
            }
            const curso = yield cursoRepository.findOne({
                where: { id: Number(id) },
            });
            if (!curso) {
                throw new Error("El curso no existe.");
            }
            const deleteResult = yield cursoRepository.delete(id);
            console.log(`Se ha quitado: ${JSON.stringify(deleteResult)}`);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: "Curso quitado." });
            }
            else {
                throw new Error("Curso no encontrado.");
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: "Error." });
        }
    }
});
exports.quitar = quitar;
