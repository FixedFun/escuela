"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const alumno_route_1 = __importDefault(require("./routes/alumno.route"));
const profesor_route_1 = __importDefault(require("./routes/profesor.route"));
const inscripto_route_1 = __importDefault(require("./routes/inscripto.route"));
const curso_route_1 = __importDefault(require("./routes/curso.route"));
const method_override_1 = __importDefault(require("method-override"));
//import { getGlobals } from 'common-es'
//import { fileURLToPath } from 'url';
const path_2 = require("path");
const __dirname = (0, path_2.dirname)(__filename);
const app = (0, express_1.default)();
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "./views"));
app.use(express_1.default.static("public"));
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    console.log(__dirname);
    return res.render("index", {
        pagina: "Universidad",
    });
});
app.use("/alumnos", alumno_route_1.default);
app.use("/profesores", profesor_route_1.default);
app.use("/cursos", curso_route_1.default);
app.use("/inscripto", inscripto_route_1.default);
app.post("/inscripto/actualizarInscripcion/:idAlumno/:idCurso", (req, res) => { });
exports.default = app;
