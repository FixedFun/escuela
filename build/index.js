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
const app_1 = __importDefault(require("./app"));
const conexion_1 = require("./db/conexion");
require("reflect-metadata");
require("dotenv/config");
require('dotenv').config();
const port = 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, conexion_1.initializeDatabase)();
            console.log("Base de datos conectada");
            app_1.default.listen(3000, () => {
                console.log(`Servidor activo en el puerto ${port}`);
            });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log("Error al conectar con la base de datos:", err.message);
            }
        }
    });
}
main();
