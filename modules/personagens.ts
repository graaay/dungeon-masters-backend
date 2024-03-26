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
            const mesa: Mesa = db.mesas.filter((m: Mesa) => m.id === request.query.id)
            return response.json(mesa.personagens);
        } catch (error) {
            return response.status(500);
        }
    }

    async getPersonagemById(request: Request, response: Response): Promise<any> {
        try {
            const db = readDB();
            const mesa: Mesa = db.mesas.filter((m: Personagem) => m.id === request.query.id);
            const personagem = mesa.personagens.filter((p: Personagem) => p.id === request.query.idPersonagem);
            return response.json(personagem);
        } catch (error) {
            return response.status(500);
        }
    }

    async newPersonagem(request: Request, response: Response) {
        try {
            const auxiliar = request.body;
            const db = readDB();
            const newId = uuidv5(auxiliar.personagem.nome, uuidv5.URL);
            console.log(request.body.personagem);
            console.log(newId);
            const personagem: Personagem = {
                ...request.body.personagem,
                id: newId
            }

            const mesa: Mesa = db.mesas.filter((m: Mesa) => m.id === request.body.id)[0];
            mesa.personagens.push(personagem);
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
                ...request.body.personagem 
            }
            const indexMesa = db.mesa.findIndex((m: Mesa) => m.id === request.body.id);

            const indexPersonagem = db.mesa[indexMesa].personagens.findIndex((p: Personagem) => p.id === personagem.id);

            db.mesa[indexMesa].personagens[indexPersonagem] = {
                ...db.mesa[indexMesa].personagens[indexPersonagem],
                nome: personagem.nome,
                tipo: personagem.tipo,
                ficha: personagem.ficha,
                status: personagem.status,
                statusAtuais: personagem.statusAtuais,
            }
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.json(personagem);

        } catch (error) {
            return response.status(500);
        }
    }

    async deletePersonagem(request: Request, response: Response) {
        try {
            const db = readDB();
            const personagem: Personagem = request.body.personagem
            const index = db.mesas.findIndex((m: Mesa) => m.id === request.query.id);
            const indexPersonagem = db.mesa[index].personagens.findIndex((p: Personagem) => p.id === personagem.id);
            db.mesa[index].personagens.splice(indexPersonagem, 1);
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.status(200);
        } catch (error) {
            response.status(500);
        }
    }

    async abrirFichaPersonagem(request: Request, response: Response) {
        console.log('me chamooouu')
        try {
            const db = readDB(); // Sua função de leitura de DB
            const idMesa = request.query.id;
            const idPersonagem = request.query.idPersonagem;
    
            const mesa = db.mesas.find((m: Mesa) => m.id === idMesa);
            if (!mesa) {
                return response.status(404).send('Mesa não encontrada');
            }
    
            const personagem = mesa.personagens.find((p: Personagem) => p.id === idPersonagem);
            if (!personagem || !personagem.ficha) {
                return response.status(404).send('Ficha do personagem não encontrada');
            }
    
            // Ajuste o diretório base para o diretório onde os PDFs devem ser localizados
            const baseDir = 'D:/RPG';
            const caminhoFicha = decodeURIComponent(personagem.ficha.replace('file:///', ''));
    
            // Verifica se o arquivo solicitado está dentro do diretório permitido
            if (!caminhoFicha.startsWith(baseDir)) {
                return response.status(403).send('Acesso negado');
            }
    
            console.log('caminho act', caminhoFicha);
            const caminhoAbsoluto = resolve(caminhoFicha);
            console.log('caminho abs', caminhoAbsoluto);
            exists(caminhoAbsoluto, (exists) => {
                if (exists) {
                    response.sendFile(caminhoAbsoluto);
                } else {
                    response.status(404).send('Ficha não encontrada');
                }
            });
        } catch (error) {
            console.error(error);
            response.status(500).send('Erro ao abrir ficha do personagem');
        }
    }    

}

export { PersonagensController }