import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import JSON5 from 'json5';
import { readFileSync, writeFileSync, readFile, exists } from 'fs';
import { Personagem, Mesa } from './interfaces'
import { join, resolve } from 'path';

const dbFilename = 'db.json5';
const readDB = () => {
    const content = readFileSync(dbFilename, 'utf-8');
    return JSON5.parse(content);
};


class PersonagensController {

    async getPersonagem(request: Request, response: Response): Promise<any> {
        try {
            const db = readDB();
            const perso: Personagem[] = db.personagens.filter((m: Personagem) => m.idMesa === request.query.id && m.idUser === request.query.idUser)
            return response.json(perso);
        } catch (error) {
            return response.status(500);
        }
    }

    async getPersonagemById(request: Request, response: Response): Promise<any> {
        try {
            console.log('Chamando', request.query);
            const db = readDB();

            const personagem: Personagem | undefined = db.personagem.find((m: Personagem) => m.idMesa === request.query.mesaId && m.idUser === request.query.idUser);
    
            if (!personagem) {
                return response.status(404).json({ error: 'Personagem não encontrado' });
            }
    
            return response.json(personagem);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    

    async newPersonagem(request: Request, response: Response) {
        try {
            const auxiliar: Personagem = request.body;
            const db = readDB();
            const newId = uuidv5(auxiliar.nome, uuidv5.URL);
            const personagem: Personagem = {
                ...request.body,
                id: newId
            }
            db.personagens.push(personagem)
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.json(personagem);

        } catch (error) {
            return response.status(500);
        }
    }

    async updatePersonagem(request: Request, response: Response) {
        try {
            const db = readDB();
            const personagem: Personagem = {
                ...request.body 
            }

            const index = db.personagens.findIndex((p: Personagem) => p.id === personagem.id && p.idUser === request.body.idUser);
            db.personagens[index] = {
                ...db.personagens[index],
                nome: personagem.nome,
                tipo: personagem.tipo,
                ficha: personagem.ficha,
                status: personagem.status,
                statusAtuais: personagem.statusAtuais,

            };

            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.json(personagem);

        } catch (error) {
            return response.status(500);
        }
    }

    async deletePersonagem(request: Request, response: Response) {
        try {
            const db = readDB();
            const index = db.personagens.findIndex((p: Personagem) => p.id === request.query.id);
            db.personagens.splice(index, 1);
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.status(200);
        } catch (error) {
            response.status(500);
        }
    }

}

export { PersonagensController }