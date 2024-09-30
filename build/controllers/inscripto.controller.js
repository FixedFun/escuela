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
exports.quitar = exports.actualizarInscripcion = exports.modificar = exports.inscribir = exports.mostrarFormularioInscripcion = exports.consultarPorFiltro = exports.consultarInscripciones = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const inscripto_model_1 = require("../models/inscripto.model");
const conexion_1 = require("../db/conexion");
const alumno_model_1 = require("../models/alumno.model");
const curso_model_1 = require("../models/curso.model");
const validar = () => [
    (0, express_validator_1.check)("idAlumno")
        .notEmpty()
        .withMessage("El id es obligatorio")
        .isNumeric()
        .withMessage("El ID debe ser un número"),
    (0, express_validator_1.check)("idCurso")
        .notEmpty()
        .withMessage("El id es obligatorio")
        .isNumeric()
        .withMessage("El ID debe ser un número"),
    (0, express_validator_1.check)("calificacion")
        .isFloat({ min: 0, max: 10 })
        .withMessage("La calificación debe ser un número entre 0 y 10"),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render("creaInscripciones", {
                pagina: "Inscribir alumno.",
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarInscripciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idAlumno, idCurso } = req.query;
    try {
        const inscriptoRepository = conexion_1.AppDataSource.getRepository(inscripto_model_1.Inscripto);
        const alumnosRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        const cursosRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        const whereConditions = {};
        if (idAlumno) {
            const alumnoIdNumber = Number(idAlumno);
            if (!isNaN(alumnoIdNumber)) {
                whereConditions.alumno = { id: alumnoIdNumber };
            }
        }
        if (idCurso) {
            const cursoIdNumber = Number(idCurso);
            if (!isNaN(cursoIdNumber)) {
                whereConditions.curso = { id: cursoIdNumber };
            }
        }
        const inscripto = yield inscriptoRepository.find({
            where: whereConditions,
            relations: ["alumno", "curso"],
        });
        const alumnos = yield alumnosRepository.find();
        const cursos = yield cursosRepository.find();
        res.render("listarInscripciones", {
            pagina: "Inscripciones",
            inscripto,
            alumnos,
            cursos,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarInscripciones = consultarInscripciones;
const consultarPorFiltro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idAlumno, idCurso } = req.params;
    const whereConditions = {};
    if (idAlumno) {
        const alumnoIdNumber = Number(idAlumno);
        if (!isNaN(alumnoIdNumber)) {
            whereConditions.alumno = { id: alumnoIdNumber };
        }
    }
    if (idCurso) {
        const cursoIdNumber = Number(idCurso);
        if (!isNaN(cursoIdNumber)) {
            whereConditions.curso = { id: cursoIdNumber };
        }
    }
    try {
        const inscriptoRepository = conexion_1.AppDataSource.getRepository(inscripto_model_1.Inscripto);
        const inscripciones = yield inscriptoRepository.find({
            where: whereConditions,
            relations: ["curso", "alumno"],
        });
        if (inscripciones.length === 0) {
            return res
                .status(404)
                .send("No se han encontrado inscripciones.");
        }
        return res.render("listarInscripciones", { inscripciones });
    }
    catch (err) {
        return res.status(500).send("Error.");
    }
});
exports.consultarPorFiltro = consultarPorFiltro;
const mostrarFormularioInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alumnoRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        const cursoRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        const alumnos = yield alumnoRepository.find();
        const cursos = yield cursoRepository.find();
        res.render("creaInscripciones", {
            pagina: "Inscribir alumno.",
            alumnos,
            cursos,
        });
    }
    catch (error) {
        res.status(500).send("Error de formulario.");
    }
});
exports.mostrarFormularioInscripcion = mostrarFormularioInscripcion;
const inscribir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        const alumnoRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        const cursoRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        const alumnos = yield alumnoRepository.find();
        const cursos = yield cursoRepository.find();
        return res.render("creaInscripciones", {
            pagina: "Inscribir alumno.",
            alumnos,
            cursos,
        });
    }
    const { idAlumno, idCurso, calificacion } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(curso_model_1.Curso);
            const alumnoRepository = transactionalEntityManager.getRepository(alumno_model_1.Alumno);
            const inscriptoRepository = transactionalEntityManager.getRepository(inscripto_model_1.Inscripto);
            const existeAlumno = yield alumnoRepository.findOne({
                where: { id: Number(idAlumno) },
            });
            if (!existeAlumno) {
                return res.status(404).json({ mensaje: "El alumno no existe." });
            }
            const existeCurso = yield cursoRepository.findOne({
                where: { id: Number(idCurso) },
            });
            if (!existeCurso) {
                return res.status(404).json({ mensaje: "El curso no existe." });
            }
            const inscripto = yield inscriptoRepository.findOne({
                where: { alumno: { id: idAlumno }, curso: { id: idCurso } },
            });
            if (inscripto) {
                return res
                    .status(400)
                    .json({ mensaje: "Ya existe una inscripción." });
            }
            const nuevaInscripcion = inscriptoRepository.create({
                idAlumno: Number(idAlumno),
                idCurso: Number(idCurso),
                nota: calificacion,
            });
            yield inscriptoRepository.save(nuevaInscripcion);
        }));
        res.redirect("/inscripto/listarInscripciones");
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.inscribir = inscribir;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idAlumno, idCurso } = req.params;
        const inscriptoRepository = conexion_1.AppDataSource.getRepository(inscripto_model_1.Inscripto);
        const inscripto = yield inscriptoRepository.findOne({
            where: {
                idAlumno: Number(idAlumno),
                idCurso: Number(idCurso),
            },
            relations: ["alumno", "curso"],
        });
        if (!inscripto) {
            return res.status(404).send("Inscripción no es existente.");
        }
        const alumnoRepository = conexion_1.AppDataSource.getRepository(alumno_model_1.Alumno);
        const cursoRepository = conexion_1.AppDataSource.getRepository(curso_model_1.Curso);
        const alumnos = yield alumnoRepository.find();
        const cursos = yield cursoRepository.find();
        res.render("modificarInscripcion", {
            pagina: "Modificar Inscripción",
            inscripto,
            alumnos,
            cursos,
        });
    }
    catch (error) {
        res.status(500).send("Error de formulario.");
    }
});
exports.modificar = modificar;
const actualizarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idAlumno, idCurso } = req.params;
        const { nota } = req.body;
        const inscriptoRepository = conexion_1.AppDataSource.getRepository(inscripto_model_1.Inscripto);
        const inscripto = yield inscriptoRepository.findOne({
            where: {
                idAlumno: Number(idAlumno),
                idCurso: Number(idCurso),
            },
        });
        if (!inscripto) {
            return res.status(404).send("Inscripción no válida.");
        }
        inscripto.nota = nota;
        yield inscriptoRepository.save(inscripto);
        res.redirect("/inscripto/listarInscripciones");
    }
    catch (error) {
        res.status(500).send("Error de inscripción.");
    }
});
exports.actualizarInscripcion = actualizarInscripcion;
const quitar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idAlumno, idCurso } = req.params;
    if (!idAlumno || !idCurso) {
        return res.status(400).json({ mensaje: "Faltan datos." });
    }
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscriptoRepository = transactionalEntityManager.getRepository(inscripto_model_1.Inscripto);
            const inscripcion = yield inscriptoRepository.findOne({
                where: {
                    idAlumno: Number(idAlumno),
                    idCurso: Number(idCurso),
                },
            });
            if (!inscripcion) {
                throw new Error("La inscripción no es existente.");
            }
            yield inscriptoRepository.remove(inscripcion);
            return res.json({ mensaje: "Inscripción quitada" });
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({ mensaje: err.message });
        }
    }
});
exports.quitar = quitar;
