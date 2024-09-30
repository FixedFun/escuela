import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { AppDataSource } from "../db/conexion";
import { Curso } from "../models/curso.model";
import { Profesor } from "../models/profesor.model";
import { Inscripto } from "../models/inscripto.model";
import { Alumno } from "../models/alumno.model";

var cursos: Curso[];

export const validar = () => [
  check("nombre")
    .notEmpty()
    .withMessage("Se debe nombrar el curso.")
    .isLength({ min: 3 })
    .withMessage("Los cursos llevan al menos 3 letras."),
  check("descripto")
    .notEmpty()
    .withMessage("Se requiere una descripción.")
    .isLength({ min: 3 })
    .withMessage("Las descripciones necesitan al menos 3 letras."),

  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render("creaCursos", {
        pagina: "Añadir curso.",
        errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    cursos = await cursoRepository.find({
      relations: ["profesor"],
    });
    res.render("listarCursos", {
      pagina: "Cursos",
      cursos,
    });
    console.log(cursos);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const consultarUno = async (
  req: Request,
  res: Response
): Promise<Curso | null> => {
  const { id } = req.params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new Error("Error de código.");
  }

  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOne({
      where: { id: idNumber },
    });
    if (curso) {
      return curso;
    } else {
      return null;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Error.");
    }
  }
};

export const insertar = async (req: Request, res: Response) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesores = await profesorRepository.find();
    return res.render("creaCursos", {
      pagina: "Añadir curso",
      profesores,
      cursos,
    });
  }

  const { nombre, descripto, idProfesor } = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);
      const cursoRepository = transactionalEntityManager.getRepository(Curso);
      const existeProfesor = await profesorRepository.findOne({
        where: { id: Number(idProfesor) },
      });

      if (!existeProfesor) {
        throw new Error("No hay curso");
      }

      const existeCurso = await cursoRepository.findOne({
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
      await cursoRepository.save(nuevoCurso);
    });

    res.redirect("/cursos/listarCursos");
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const modificar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripto, idProfesor } = req.body;

  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!curso) {
      return res.status(404).json({ mensaje: "El curso no es válido." });
    }

    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({
      where: { id: idProfesor },
    });
    if (!profesor) {
      return res.status(400).json({ mensaje: "El curso no es válido." });
    }

    cursoRepository.merge(curso, { nombre, descripto, profesor });
    await cursoRepository.save(curso);

    return res.redirect("/cursos/listarCursos");
  } catch (error) {
    console.error("Error de modificación.", error);
    return res.status(500).send("Error del servidor.");
  }
};

export const quitar = async (req: Request, res: Response) => {
  console.log(req.params);
  const { id } = req.params;
  console.log(`ID Curso: ${id}`);

  if (!id) {
    return res.status(400).json({ mensaje: "Faltan datos." });
  }
  try {
    console.log(`Código: ${id} `);
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const inscriptoRepository =
        transactionalEntityManager.getRepository(Inscripto);
      const cursoRepository = transactionalEntityManager.getRepository(Curso);

      const numAlumnos = await inscriptoRepository.count({
        where: { curso: { id: Number(id) } },
      });
      console.log(
        `Alumnos inscriptos: ${numAlumnos}`
      );

      if (numAlumnos > 0) {
        throw new Error("Hay curso, no se puede quitar.");
      }
      const curso = await cursoRepository.findOne({
        where: { id: Number(id) },
      });
      if (!curso) {
        throw new Error("El curso no existe.");
      }

      const deleteResult = await cursoRepository.delete(id);
      console.log(
        `Se ha quitado: ${JSON.stringify(deleteResult)}`
      );
      if (deleteResult.affected === 1) {
        return res.json({ mensaje: "Curso quitado." });
      } else {
        throw new Error("Curso no encontrado.");
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ mensaje: err.message });
    } else {
      res.status(400).json({ mensaje: "Error." });
    }
  }
};
