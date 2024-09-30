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
exports.AppDataSource = void 0;
exports.initializeDatabase = initializeDatabase;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
const promise_1 = require("mysql2/promise");
const alumno_model_1 = require("../models/alumno.model");
const curso_model_1 = require("../models/curso.model");
const profesor_model_1 = require("../models/profesor.model");
const inscripto_model_1 = require("../models/inscripto.model");
//import { Alias } from "typeorm/query-builder/Alias";
dotenv_1.default.config();
const port = process.env.BD_PORT
    ? parseInt(process.env.BD_PORT, 10)
    : 3306;
function createDatabaseIfNotExists() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, promise_1.createConnection)({
            host: process.env.DB_HOST,
            port,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        try {
            yield connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        }
        catch (error) {
            console.error("Error de base de datos.", error);
        }
        finally {
            connection.end();
        }
    });
}
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [profesor_model_1.Profesor, alumno_model_1.Alumno, curso_model_1.Curso, inscripto_model_1.Inscripto],
    synchronize: true,
    logging: true,
});
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createDatabaseIfNotExists();
        yield exports.AppDataSource.initialize();
    });
}
