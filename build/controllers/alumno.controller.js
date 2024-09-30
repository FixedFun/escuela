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
const alumno_model_1 = require("../models/alumno.model");
const conexion_1 = require("../db/conexion");
const inscripto_model_1 = require("../models/inscripto.model");
var alumnos;
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
    (0, express_validator_1.check)("correo").isEmail().withMessage("Debe proporcionar un correo válido"),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render("creaAlumnos", {
                pagina: "Añadir alumno.",
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alumnoRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        alumnos = yield alumnoRepository.find();
        res.render("listarAlumnos", {
            pagina: "Alumnos",
            alumnos,
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
        throw new Error("Error de código.");
    }
    try {
        const alumnoRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        const alumno = yield alumnoRepository.findOne({
            where: { id: idNumber },
        });
        if (alumno) {
            return alumno;
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
            throw new Error("Error desconocido");
        }
    }
});
exports.consultarUno = consultarUno;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render("creaAlumnos", {
            pagina: "Añadir alumno.",
            errores: errores.array(),
        });
    }
    const { dni, nombre, apellido, correo } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const alumnoRepository = transactionalEntityManager.getRepository(alumno_model_1.Alumno);
            const existeAlumno = yield alumnoRepository.findOne({
                where: [{ dni }, { correo }],
            });
            if (existeAlumno) {
                throw new Error("El alumno ya existe.");
            }
            const nuevoAlumno = alumnoRepository.create({
                dni,
                nombre,
                apellido,
                correo,
            });
            yield alumnoRepository.save(nuevoAlumno);
        }));
        const alumnos = yield conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno).find();
        res.render("listarAlumnos", {
            pagina: "Alumnos",
            alumnos,
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
    const { dni, nombre, apellido, correo } = req.body;
    try {
        const alumnoRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        const alumno = yield alumnoRepository.findOne({
            where: { id: parseInt(id) },
        });
        if (!alumno) {
            return res.status(404).send("Alumno no existente.");
        }
        alumnoRepository.merge(alumno, { dni, nombre, apellido, correo });
        yield alumnoRepository.save(alumno);
        return res.redirect("/alumnos/listarAlumnos");
    }
    catch (error) {
        console.error("Error de modificación.", error);
        return res.status(500).send("Error del servidor.");
    }
});
exports.modificar = modificar;
const quitar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        console.log(`Código: ${id}`);
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursosAlumnosRepository = transactionalEntityManager.getRepository(inscripto_model_1.Inscripto);
            const alumnoRepository = transactionalEntityManager.getRepository(alumno_model_1.Alumno);
            const cursosRelacionados = yield cursosAlumnosRepository.count({
                where: { alumno: { id: Number(id) } },
            });
            if (cursosRelacionados > 0) {
                throw new Error("Alumno debe estar sin cursos registrados para quitar.");
            }
            const deleteResult = yield alumnoRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: "El alumno se ha quitado." });
            }
            else {
                throw new Error("Alumno no encontrado.");
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
