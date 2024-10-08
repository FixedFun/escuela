"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
//import profesorRoute from './routes/profesorRoute';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.get('/.', (req, res) => {
    res.send("app Universidad");
});
app.post('/', (req, res) => {
    res.send({
        data: req.body
    });
});
app.listen(3000, () => {
    console.log('La aplicación esta escuchando en el puerto 3000');
});
//app.use('/profesores', profesorRoute);
exports.default = app;
