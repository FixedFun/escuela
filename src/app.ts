import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import alumnoRouter from "./routes/alumno.route";
import profesorRouter from "./routes/profesor.route";
import inscripcionRouter from "./routes/inscripto.route";
import cursoRouter from "./routes/curso.route";
import methodOverride from "method-override";
//import { getGlobals } from 'common-es'
//import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(__filename);

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static("public"));

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  console.log(__dirname);
  return res.render("index", {
    pagina: "Universidad",
  });
});
app.use("/alumnos", alumnoRouter);
app.use("/profesores", profesorRouter);
app.use("/cursos", cursoRouter);
app.use("/inscripto", inscripcionRouter);
app.post(
  "/inscripto/actualizarInscripcion/:idAlumno/:idCurso",
  (req, res) => {}
);

export default app;
