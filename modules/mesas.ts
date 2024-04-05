import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import JSON5 from 'json5';
import { readFileSync, writeFileSync } from 'fs';
import { Personagem, Mesa } from './interfaces'

const dbFilename = 'db.json5';
const readDB = () => {
    const content = readFileSync(dbFilename, 'utf-8');
    return JSON5.parse(content);
};

class MesasController {

    async getMesas(request: Request, response: Response): Promise<any> {
        try {
            const db = readDB();
            const mesas = db.mesas.filter((m: Mesa) => m.idUser === request.query.idUser)
            return response.json(mesas)
        } catch (error) {
            return response.status(500);
        }
    }

    async getByIdMesas(request: Request, response: Response): Promise<any> {
        try {
            const db = readDB();
            const mesa = db.mesas.filter((m: Mesa) => m.id === request.query.id && m.idUser === request.query.idUser)
            return response.json(mesa)
        } catch (error) {
            return response.status(500);
        }
    }

    async newMesas(request: Request, response: Response) {
        try {
            const db = readDB();
            const mesa: Mesa = {
                id: uuidv5(request.body.nome, uuidv5.URL),
                idUser: request.body.idUser,
                ...request.body ,
                personagens: [],
            }
            db.mesas.push(mesa);
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.json(mesa);
        } catch (error) {
            return response.status(500);
        }
    }

    async updateMesas(request: Request, response: Response) {
        try {
            const db = readDB();
            const mesa: Mesa = {
                ...request.body 
            }
            const index = db.mesas.findIndex((m: Mesa) => m.id === mesa.id && m.idUser === request.query.idUser);
            db.mesas[index] = {
                ...db.mesas[index],
                nome: mesa.nome,
                nivel: mesa.nivel,
                sistema: mesa.sistema,
                mesaAtiva: mesa.mesaAtiva,
            };
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.json(mesa);

        } catch (error) {
            return response.status(500);
        }
    }

    async deleteMesas(request: Request, response: Response) {
        try {
            const db = readDB();
            const index = db.mesas.findIndex((m: Mesa) => m.id === request.query.id && m.idUser === request.query.idUser);
            db.mesas.splice(index, 1);
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.status(200);
        } catch (error) {
            response.status(500);
        }
    }
}

export { MesasController }