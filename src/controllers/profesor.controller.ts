import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Profesor } from "../models/profesor.model";
import { AppDataSource } from "../db/conexion";
import { Curso } from "../models/curso.model";
//import { Inscripto } from "../models/curso.alumno.model";

var profesores: Profesor[];

export const validar = () => [
  check("dni")
    .notEmpty()
    .withMessage("Se debe incluir el D.N.I.")
    .isLength({ min: 7 })
    .withMessage("El D.N.I. lleva 7 números.")
    .isNumeric()
    .withMessage("Error en D.I."),
  check("nombre")
    .notEmpty()
    .withMessage("Se debe colocar el nombre")
    .isLength({ min: 3 })
    .withMessage("El nombre lleva al menos 3 letras"),
  check("apellido")
    .notEmpty()
    .withMessage("Se debe colocar el apellido")
    .isLength({ min: 3 })
    .withMessage("El apellido lleva al menos 3 letras"),
  check("rubro")
    .notEmpty()
    .withMessage("Se debe colocar el rubro")
    .isLength({ min: 3 })
    .withMessage("El rubro lleva al menos 3 letras"),
  check("correo").isEmail().withMessage("Se debe colocar el correo"),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render("creaProfesores", {
        pagina: "Añadir profesor",
        errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);

    const profesores = await profesorRepository.find();
    res.render("listarProfesores", {
      pagina: "Profesores",
      profesores,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const consultarUno = async (
  req: Request,
  res: Response
): Promise<Profesor | null> => {
  const { id } = req.params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new Error("Error de código");
  }

  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({
      where: { id: idNumber },
    });

    if (profesor) {
      return profesor;
    } else {
      return null;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Error, llame a asistencia");
    }
  }
};

export const insertar = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render("creaProfesores", {
      pagina: "Añadir profesor",
      errores: errores.array(),
    });
  }

  const { dni, nombre, apellido, correo, rubro, numtel } = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);
      const existeProfesor = await profesorRepository.findOne({
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
      await profesorRepository.save(nuevoProfesor);
    });
    const profesores = await AppDataSource.getRepository(Profesor).find();
    res.render("listarProfesores", {
      pagina: "Profesores",
      profesores,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const modificar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dni, nombre, apellido, correo, rubro, numtel } = req.body;
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({
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
    await profesorRepository.save(profesor);
    return res.redirect("/profesores/listarProfesores");
  } catch (error) {
    console.error("Error con la creación.", error);
    return res.status(500).send("Error del servidor.");
  }
};

export const quitar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    console.log(`Código del profesor: ${id}`);
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursosRepository = transactionalEntityManager.getRepository(Curso);
      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);

      const cursosRelacionados = await cursosRepository.count({
        where: { profesor: { id: Number(id) } },
      });

      if (cursosRelacionados > 0) {
        throw new Error(
          "Se deben quitar las cursadas antes de quitar un prfoesor"
        );
      }
      const deleteResult = await profesorRepository.delete(id);

      if (deleteResult.affected === 1) {
        return res.json({ mensaje: "Profesor quitado" });
      } else {
        throw new Error("Profesor no encontrado");
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ mensaje: err.message });
    } else {
      res.status(400).json({ mensaje: "Error" });
    }
  }
};
