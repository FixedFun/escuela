import app from "./app";

import { initializeDatabase } from "./db/conexion";
import "reflect-metadata";

import 'dotenv/config';
require('dotenv').config();


const port = 3000;

async function main() {
  try {
    await initializeDatabase();
    console.log("Base de datos conectada");

    app.listen(3000, () => {
      console.log(`Servidor activo en el puerto ${port}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error al conectar con la base de datos:", err.message);
    }
  }
}

main();
