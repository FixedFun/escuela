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
const profesor_model_1 = require("../models/profesor.model");
const conexion_1 = require("../db/conexion");
const curso_model_1 = require("../models/curso.model");
//import { Inscripto } from "../models/curso.alumno.model";
var profesores;
const validar = () => [
    (0, express_validator_1.check)("dni")
        .notEmpty()
        .withMessage("Se debe incluir el D.N.I.")
        .isLength({ min: 7 })
        .withMessage("El D.N.I. lleva 7 números.")
        .isNumeric()
        .withMessage("Error en D.I."),
    (0, express_validator_1.check)("nombre")
        .notEmpty()
        .withMessage("Se debe colocar el nombre")
        .isLength({ min: 3 })
        .withMessage("El nombre lleva al menos 3 letras"),
    (0, express_validator_1.check)("apellido")
        .notEmpty()
        .withMessage("Se debe colocar el apellido")
        .isLength({ min: 3 })
        .withMessage("El apellido lleva al menos 3 letras"),
    (0, express_validator_1.check)("rubro")
        .notEmpty()
        .withMessage("Se debe colocar el rubro")
        .isLength({ min: 3 })
        .withMessage("El rubro lleva al menos 3 letras"),
    (0, express_validator_1.check)("correo").isEmail().withMessage("Se debe colocar el correo"),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render("creaProfesores", {
                pagina: "Añadir profesor",
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesor_model_1.Profesor);
        const profesores = yield profesorRepository.find();
        res.render("listarProfesores", {
            pagina: "Profesores",
            profesores,
        });
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
        throw new Error("Error de código");
    }
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesor_model_1.Profesor);
        const profesor = yield profesorRepository.findOne({
            where: { id: idNumber },
        });
        if (profesor) {
            return profesor;
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
            throw new Error("Error, llame a asistencia");
        }
    }
});
exports.consultarUno = consultarUno;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render("creaProfesores", {
            pagina: "Añadir profesor",
            errores: errores.array(),
        });
    }
    const { dni, nombre, apellido, correo, rubro, numtel } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const profesorRepository = transactionalEntityManager.getRepository(profesor_model_1.Profesor);
            const existeProfesor = yield profesorRepository.findOne({
                where: [{ dni }, { correo }],
            });
            if (existeProfesor) {
                throw new Error("Ya hay un profesor con esos datos.");
            }
            const nuevoProfesor = profesorRepository.create({
                dni,
                nombre,
                apellido,
                correo,
                rubro,
                numtel,
            });
            yield profesorRepository.save(nuevoProfesor);
        }));
        const profesores = yield conexion_1.AppDataSource.getRepository(profesor_model_1.Profesor).find();
        res.render("listarProfesores", {
            pagina: "Profesores",
            profesores,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { dni, nombre, apellido, correo, rubro, numtel } = req.body;
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesor_model_1.Profesor);
        const profesor = yield profesorRepository.findOne({
            where: { id: parseInt(id) },
        });
        if (!profesor) {
            return res.status(404).send("Profesor no encontrado");
        }
        profesorRepository.merge(profesor, {
            dni,
            nombre,
            apellido,
            correo,
            rubro,
            numtel,
        });
        yield profesorRepository.save(profesor);
        return res.redirect("/profesores/listarProfesores");
    }
    catch (error) {
        console.error("Error con la creación.", error);
        return res.status(500).send("Error del servidor.");
    }
});
exports.modificar = modificar;
const quitar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        console.log(`Código del profesor: ${id}`);
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursosRepository = transactionalEntityManager.getRepository(curso_model_1.Curso);
            const profesorRepository = transactionalEntityManager.getRepository(profesor_model_1.Profesor);
            const cursosRelacionados = yield cursosRepository.count({
                where: { profesor: { id: Number(id) } },
            });
            if (cursosRelacionados > 0) {
                throw new Error("Se deben quitar las cursadas antes de quitar un prfoesor");
            }
            const deleteResult = yield profesorRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: "Profesor quitado" });
            }
            else {
                throw new Error("Profesor no encontrado");
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: "Error" });
        }
    }
});
exports.quitar = quitar;
