import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { Inscripto } from "../models/inscripto.model";
import { AppDataSource } from "../db/conexion";
import { Alumno } from "../models/alumno.model";
import { Curso } from "../models/curso.model";

export const validar = () => [
  check("idAlumno")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isNumeric()
    .withMessage("El ID debe ser un número"),
  check("idCurso")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isNumeric()
    .withMessage("El ID debe ser un número"),
  check("calificacion")
    .isFloat({ min: 0, max: 10 })
    .withMessage("La calificación debe ser un número entre 0 y 10"),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render("creaInscripciones", {
        pagina: "Inscribir alumno.",
        errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarInscripciones = async (req: Request, res: Response) => {
  const { idAlumno, idCurso } = req.query;

  try {
    const inscriptoRepository =
      AppDataSource.getRepository(Inscripto);
    const alumnosRepository = AppDataSource.getRepository(Alumno);
    const cursosRepository = AppDataSource.getRepository(Curso);

    const whereConditions: any = {};

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

    const inscripto = await inscriptoRepository.find({
      where: whereConditions,
      relations: ["alumno", "curso"],
    });

    const alumnos = await alumnosRepository.find();
    const cursos = await cursosRepository.find();

    res.render("listarInscripciones", {
      pagina: "Inscripciones",
      inscripto,
      alumnos,
      cursos,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const consultarPorFiltro = async (req: Request, res: Response) => {
  const { idAlumno, idCurso } = req.params;

  const whereConditions: any = {};
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
    const inscriptoRepository =
      AppDataSource.getRepository(Inscripto);
    const inscripciones = await inscriptoRepository.find({
      where: whereConditions,
      relations: ["curso", "alumno"],
    });

    if (inscripciones.length === 0) {
      return res
        .status(404)
        .send("No se han encontrado inscripciones.");
    }

    return res.render("listarInscripciones", { inscripciones });
  } catch (err: unknown) {
    return res.status(500).send("Error.");
  }
};

export const mostrarFormularioInscripcion = async (
  req: Request,
  res: Response
) => {
  try {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const alumnos = await alumnoRepository.find();
    const cursos = await cursoRepository.find();

    res.render("creaInscripciones", {
      pagina: "Inscribir alumno.",
      alumnos,
      cursos,
    });
  } catch (error) {
    res.status(500).send("Error de formulario.");
  }
};

export const inscribir = async (req: Request, res: Response) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const alumnos = await alumnoRepository.find();
    const cursos = await cursoRepository.find();
    return res.render("creaInscripciones", {
      pagina: "Inscribir alumno.",
      alumnos,
      cursos,
    });
  }

  const { idAlumno, idCurso, calificacion } = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursoRepository = transactionalEntityManager.getRepository(Curso);
      const alumnoRepository =
        transactionalEntityManager.getRepository(Alumno);
      const inscriptoRepository =
        transactionalEntityManager.getRepository(Inscripto);

      const existeAlumno = await alumnoRepository.findOne({
        where: { id: Number(idAlumno) },
      });
      if (!existeAlumno) {
        return res.status(404).json({ mensaje: "El alumno no existe." });
      }

      const existeCurso = await cursoRepository.findOne({
        where: { id: Number(idCurso) },
      });
      if (!existeCurso) {
        return res.status(404).json({ mensaje: "El curso no existe." });
      }

      const inscripto = await inscriptoRepository.findOne({
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

      await inscriptoRepository.save(nuevaInscripcion);
    });

    res.redirect("/inscripto/listarInscripciones");
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const modificar = async (req: Request, res: Response) => {
  try {
    const { idAlumno, idCurso } = req.params;

    const inscriptoRepository =
      AppDataSource.getRepository(Inscripto);
    const inscripto = await inscriptoRepository.findOne({
      where: {
        idAlumno: Number(idAlumno),
        idCurso: Number(idCurso),
      },
      relations: ["alumno", "curso"],
    });

    if (!inscripto) {
      return res.status(404).send("Inscripción no es existente.");
    }

    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const cursoRepository = AppDataSource.getRepository(Curso);

    const alumnos = await alumnoRepository.find();
    const cursos = await cursoRepository.find();

    res.render("modificarInscripcion", {
      pagina: "Modificar Inscripción",
      inscripto,
      alumnos,
      cursos,
    });
  } catch (error) {
    res.status(500).send("Error de formulario.");
  }
};

export const actualizarInscripcion = async (req: Request, res: Response) => {
  try {
    const { idAlumno, idCurso } = req.params;
    const { nota } = req.body;

    const inscriptoRepository =
      AppDataSource.getRepository(Inscripto);

    const inscripto = await inscriptoRepository.findOne({
      where: {
        idAlumno: Number(idAlumno),
        idCurso: Number(idCurso),
      },
    });

    if (!inscripto) {
      return res.status(404).send("Inscripción no válida.");
    }

    inscripto.nota = nota;
    await inscriptoRepository.save(inscripto);

    res.redirect("/inscripto/listarInscripciones");
  } catch (error) {
    res.status(500).send("Error de inscripción.");
  }
};

export const quitar = async (req: Request, res: Response) => {
  const { idAlumno, idCurso } = req.params;

  if (!idAlumno || !idCurso) {
    return res.status(400).json({ mensaje: "Faltan datos." });
  }

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const inscriptoRepository =
        transactionalEntityManager.getRepository(Inscripto);

      const inscripcion = await inscriptoRepository.findOne({
        where: {
          idAlumno: Number(idAlumno),
          idCurso: Number(idCurso),
        },
      });

      if (!inscripcion) {
        throw new Error("La inscripción no es existente.");
      }

      await inscriptoRepository.remove(inscripcion);

      return res.json({ mensaje: "Inscripción quitada" });
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ mensaje: err.message });
    }
  }
};
