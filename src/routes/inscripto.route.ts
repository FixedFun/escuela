import express from "express";
//import { Router, Request, Response } from 'express';
import {
  inscribir,
  quitar,
  validar,
  consultarPorFiltro,
  consultarInscripciones,
  modificar,
  actualizarInscripcion,
  mostrarFormularioInscripcion,
} from "../controllers/inscripto.controller";

const router = express.Router();

//L
router.get("/listarInscripciones", consultarInscripciones);
router.get("/inscripto/listarInscripciones", consultarPorFiltro as any);

//A
router.get("/creaInscripciones", mostrarFormularioInscripcion);
router.post("/creaInscripciones", validar(), inscribir);

//M
router.get("/modificarInscripcion/:idAlumno/:idCurso", modificar as any);

router.post(
  "/actualizarInscripcion/:idAlumno/:idCurso",
  actualizarInscripcion as any
);

//Q

router.delete("/:idAlumno/:idCurso", quitar as any);

export default router;
