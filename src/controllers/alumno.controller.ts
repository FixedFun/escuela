import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Alumno } from "../models/alumno.model";
import { AppDataSource } from "../db/conexion";
import { Inscripto } from "../models/inscripto.model";

var alumnos: Alumno[];

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
  check("correo").isEmail().withMessage("Debe proporcionar un correo válido"),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render("creaAlumnos", {
        pagina: "Añadir alumno.",
        errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    alumnos = await alumnoRepository.find();
    res.render("listarAlumnos", {
      pagina: "Alumnos",
      alumnos,
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
): Promise<Alumno | null> => {
  const { id } = req.params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new Error("Error de código.");
  }

  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumno = await alumnoRepository.findOne({
      where: { id: idNumber },
    });

    if (alumno) {
      return alumno;
    } else {
      return null;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Error desconocido");
    }
  }
};

export const insertar = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render("creaAlumnos", {
      pagina: "Añadir alumno.",
      errores: errores.array(),
    });
  }

  const { dni, nombre, apellido, correo } = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const alumnoRepository =
        transactionalEntityManager.getRepository(Alumno);
      const existeAlumno = await alumnoRepository.findOne({
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
      await alumnoRepository.save(nuevoAlumno);
    });
    const alumnos = await AppDataSource.getRepository(Alumno).find();
    res.render("listarAlumnos", {
      pagina: "Alumnos",
      alumnos,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};
export const modificar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dni, nombre, apellido, correo } = req.body;
  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumno = await alumnoRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!alumno) {
      return res.status(404).send("Alumno no existente.");
    }
    alumnoRepository.merge(alumno, { dni, nombre, apellido, correo });
    await alumnoRepository.save(alumno);
    return res.redirect("/alumnos/listarAlumnos");
  } catch (error) {
    console.error("Error de modificación.", error);
    return res.status(500).send("Error del servidor.");
  }
};

export const quitar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    console.log(`Código: ${id}`);
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursosAlumnosRepository =
        transactionalEntityManager.getRepository(Inscripto);
      const alumnoRepository =
        transactionalEntityManager.getRepository(Alumno);

      const cursosRelacionados = await cursosAlumnosRepository.count({
        where: { alumno: { id: Number(id) } },
      });
      if (cursosRelacionados > 0) {
        throw new Error(
          "Alumno debe estar sin cursos registrados para quitar."
        );
      }
      const deleteResult = await alumnoRepository.delete(id);

      if (deleteResult.affected === 1) {
        return res.json({ mensaje: "El alumno se ha quitado." });
      } else {
        throw new Error("Alumno no encontrado.");
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
