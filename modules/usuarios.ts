import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import JSON5 from 'json5';
import { readFileSync, writeFileSync } from 'fs';
import { Usuario } from './interfaces';
import { AuthenticateService } from '../app/services/token'

const dbFilename = 'db.json5';
const readDB = () => {
    const content = readFileSync(dbFilename, 'utf-8');
    return JSON5.parse(content);
};

class UsuarioController {

    async authEmail(request: Request, response: Response) {
        try {
            const db = readDB();
            const service = new AuthenticateService();
            const { email, socialId } = request.body;

            const user = db.usuarios.find((u: Usuario) => u.email === email && u.socialId === socialId);

            if (!user) {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }

            const token = await service.generateToken(user.id!);
            const respostaFull = { ...user, token };

            return response.json(respostaFull);
        } catch (error) {
            console.error(error); // Log de erro melhorado
            return response.status(500).json({ message: "Ocorreu um erro no servidor." });
        }
    }
    

    async register(request: Request, response: Response) {
        try {
            const db = readDB();
            const {name, password, email} = request.body;
            const newUser: Usuario = {
                id: uuidv5(name, uuidv5.URL),
                name: name,
                email: email,
                password: password // criptografar
            }

            db.usuarios.push(newUser);
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            response.json(newUser);
        } catch(error) {
            return response.status(500);
        }
    }

}

export { UsuarioController };