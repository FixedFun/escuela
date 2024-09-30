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
//import { Router, Request, Response } from 'express';
const profesor_controller_1 = require("../controllers/profesor.controller");
const router = express_1.default.Router();
router.get("/listarProfesores", profesor_controller_1.consultarTodos);
// Insertar
router.get("/creaProfesores", (req, res) => {
    res.render("creaProfesores", {
        pagina: "Crear profesor",
    });
});
router.post("/", (0, profesor_controller_1.validar)(), profesor_controller_1.insertar);
// Modificar
router.get("/modificaProfesor/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield (0, profesor_controller_1.consultarUno)(req, res);
        if (!profesor) {
            res.status(404).send("Profesor no encontrado.");
        }
        res.render("modificaProfesor", {
            profesor,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
}));
router.put("/:id", profesor_controller_1.modificar);
// Quitar
router.delete("/:id", profesor_controller_1.quitar);
exports.default = router;
