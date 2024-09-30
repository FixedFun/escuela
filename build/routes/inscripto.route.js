"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { Router, Request, Response } from 'express';
const inscripto_controller_1 = require("../controllers/inscripto.controller");
const router = express_1.default.Router();
//L
router.get("/listarInscripciones", inscripto_controller_1.consultarInscripciones);
router.get("/inscripto/listarInscripciones", inscripto_controller_1.consultarPorFiltro);
//A
router.get("/creaInscripciones", inscripto_controller_1.mostrarFormularioInscripcion);
router.post("/creaInscripciones", (0, inscripto_controller_1.validar)(), inscripto_controller_1.inscribir);
//M
router.get("/modificarInscripcion/:idAlumno/:idCurso", inscripto_controller_1.modificar);
router.post("/actualizarInscripcion/:idAlumno/:idCurso", inscripto_controller_1.actualizarInscripcion);
//Q
router.delete("/:idAlumno/:idCurso", inscripto_controller_1.quitar);
exports.default = router;
