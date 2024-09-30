import { Request, Response } from 'express';
import { connect } from "../database"
//import Post from '../model/Post';

export async function obtenerMuchos(req: Request, res: Response): Promise<Response> {
    const conn = await connect();
    const posts = await conn.query("SELECT * FROM prueba");
    return res.json(posts[0]);
}

export async function obtenerUno(req: Request, res: Response): Promise<Response> {
    const id = req.params.postId;
    const conn = await connect();
    const posts = await conn.query(`SELECT * FROM prueba WHERE id = ?`, [id]);
    return res.json(posts[0]);
}

export async function crearUno(req: Request, res: Response) {
    //const crearU: Post = req.body;
    const conn = await connect();
    //await conn.query(`INSERT INTO prueba (nombre, num1, num2 VALUES ('?', '?', '?')`, [crearU])
    return res.json({
        message: "Insertaste uno."
    });
}

export async function actualizarUno(req: Request, res: Response) {
    const id = req.params.postId;
    //const actualizarUno: Post = req.body;
    const conn = await connect();
    await conn.query(`UPDATE prueba SET ? WHERE id = ?`, [actualizarUno, id])
    return res.json({
        message: "Actualizado."
    })
}

export async function borrarUno(req: Request, res: Response) {
    const id = req.params.postId;
    const conn = await connect();
    await conn.query(`DELETE FROM prueba WHERE id = ?`, [id])
    return res.json({
        message: "Borrado."
    })
}