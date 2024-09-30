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
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerMuchos = obtenerMuchos;
exports.obtenerUno = obtenerUno;
exports.crearUno = crearUno;
exports.actualizarUno = actualizarUno;
exports.borrarUno = borrarUno;
const database_1 = require("../database");
//import Post from '../model/Post';
function obtenerMuchos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, database_1.connect)();
        const posts = yield conn.query("SELECT * FROM prueba");
        return res.json(posts[0]);
    });
}
function obtenerUno(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.postId;
        const conn = yield (0, database_1.connect)();
        const posts = yield conn.query(`SELECT * FROM prueba WHERE id = ?`, [id]);
        return res.json(posts[0]);
    });
}
function crearUno(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //const crearU: Post = req.body;
        const conn = yield (0, database_1.connect)();
        //await conn.query(`INSERT INTO prueba (nombre, num1, num2 VALUES ('?', '?', '?')`, [crearU])
        return res.json({
            message: "Insertaste uno."
        });
    });
}
function actualizarUno(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.postId;
        //const actualizarUno: Post = req.body;
        const conn = yield (0, database_1.connect)();
        yield conn.query(`UPDATE prueba SET ? WHERE id = ?`, [actualizarUno, id]);
        return res.json({
            message: "Actualizado."
        });
    });
}
function borrarUno(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.postId;
        const conn = yield (0, database_1.connect)();
        yield conn.query(`DELETE FROM prueba WHERE id = ?`, [id]);
        return res.json({
            message: "Borrado."
        });
    });
}
