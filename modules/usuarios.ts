import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import JSON5 from 'json5';
import { readFileSync, writeFileSync } from 'fs';
import { Usuario } from './interfaces';
import { AuthenticateService } from '../app/services/token';
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../app/config/env"

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
            console.log('user',user);
            if (!user) {
                console.log('entrou né');
                return response.status(202).json({ message: "Prosseguir para cadastramento."});
            }
    
            const token = await service.generateToken(user.id!);
            const respostaFull = { ...user, token };
    
            return response.json(respostaFull);
        } catch (error) {
            console.error(error); // Log de erro melhorado
            return response.status(500).json({ message: "Ocorreu um erro no servidor." });
        }
    }

    async validateAuth(request: Request, response: Response) {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                // throw new AppError("É necessário estar autenticado!", 401);
            }
            
            const [, token] = authHeader!.split(" ");
            const decoded: any = verify(token, SECRET_KEY!);
            const db = readDB();
            const user = db.usuarios.find((u: Usuario) => u.id === decoded.id );
            return response.json({...user, token});

        } catch(error) {

        }
    }
    

    async register(request: Request, response: Response) {
        try {
            const db = readDB();
            const service = new AuthenticateService();
            const {name, password, email, id} = request.body;
            const newUser: Usuario = {
                id: uuidv5(name, uuidv5.URL),
                name: name,
                email: email,
                socialId: id,
                password: password // criptografar
            }

            db.usuarios.push(newUser);
            writeFileSync(dbFilename, JSON5.stringify(db, null, 2));
            const token = await service.generateToken(newUser.id!);
            const respostaFull = { ...newUser, token };
            response.json(respostaFull);
        } catch(error) {
            return response.status(500);
        }
    }

}

export { UsuarioController };