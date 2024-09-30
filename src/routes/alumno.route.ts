import express from "express";
import {
  insertar,
  modificar,
  quitar,
  validar,
  consultarUno,
  consultarTodos,
} from "../controllers/alumno.controller";

const router = express.Router();

router.get("/listarAlumnos", consultarTodos);

//A

router.get("/creaAlumnos", (req, res) => {
  res.render("creaAlumnos", {
    pagina: "Crear Alumno",
  });
});

router.post("/", validar(), insertar);

//M
router.get("/modificaAlumno/:id", async (req, res) => {
  try {
    const alumno = await consultarUno(req, res);
    if (!alumno) {
      res.status(404).send("Alumno no encontrado");
    }
    res.render("modificaAlumno", {
      alumno,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
});

router.put("/:id", modificar as any);

//Q
router.delete("/:id", quitar);

export default router;
