import express from "express";
import { Router, Request, Response } from 'express';
import {
  insertar,
  modificar,
  quitar,
  validar,
  consultarUno,
  consultarTodos,
} from "../controllers/curso.controller";

const router = express.Router();

router.get("/listarCursos", consultarTodos);

//A

router.get("/creaCursos", (req, res) => {
  res.render("creaCursos", {
    pagina: "Crear curso",
  });
});

router.post("/", validar(), insertar);

//M

router.get("/modificaCurso/:id", async (req, res) => {
  try {
    const curso = await consultarUno(req, res);
    if (!curso) {
      res.status(404).send("Curso no encontrado.");
    }
    res.render("modificaCurso", {
      curso,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
});

router.put("/:id", modificar as any);

//Q
router.delete("/:id", quitar as any);

export default router;
