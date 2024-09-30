import { Router } from 'express';
import { obtenerMuchos, obtenerUno, crearUno, borrarUno, actualizarUno } from '../controllers/post.controller';

const router = Router();

router.route("/")
    .get(obtenerMuchos as any)
    .post(crearUno as any);

router.route("/:pruebaId")
    .get(obtenerUno as any)
    .delete(borrarUno as any)
    .put(actualizarUno as any)

export default router;