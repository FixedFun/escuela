import express from "express";
//import { Router, Request, Response } from 'express';
import {
  insertar,
  modificar,
  quitar,
  validar,
  consultarUno,
  consultarTodos,
} from "../controllers/profesor.controller";

const router = express.Router();

router.get("/listarProfesores", consultarTodos);

// Insertar
router.get("/creaProfesores", (req, res) => {
  res.render("creaProfesores", {
    pagina: "Crear profesor",
  });
});

router.post("/", validar(), insertar);

// Modificar
router.get("/modificaProfesor/:id", async (req, res) => {
  try {
    const profesor = await consultarUno(req, res);
    if (!profesor) {
      res.status(404).send("Profesor no encontrado.");
    }
    res.render("modificaProfesor", {
      profesor,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
});

router.put("/:id", modificar as any);

// Quitar
router.delete("/:id", quitar);

export default router;