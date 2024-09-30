"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const alumno_controller_1 = require("../controllers/alumno.controller");
const router = express_1.default.Router();
router.get("/listarAlumnos", alumno_controller_1.consultarTodos);
//A
router.get("/creaAlumnos", (req, res) => {
    res.render("creaAlumnos", {
        pagina: "Crear Alumno",
    });
});
router.post("/", (0, alumno_controller_1.validar)(), alumno_controller_1.insertar);
//M
router.get("/modificaAlumno/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alumno = yield (0, alumno_controller_1.consultarUno)(req, res);
        if (!alumno) {
            res.status(404).send("Alumno no encontrado");
        }
        res.render("modificaAlumno", {
            alumno,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
}));
router.put("/:id", alumno_controller_1.modificar);
//Q
router.delete("/:id", alumno_controller_1.quitar);
exports.default = router;
