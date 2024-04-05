import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../config/env"
import { NextFunction, Request, Response } from "express";

export async function validateAuthentication(request: Request, response: Response, next: NextFunction) {
    
    const authHeader = request.headers.authorization;
    
    // Variavel para controlar onde irá adicionar o usuário
    const type = (request.method === "GET" || request.method === "DELETE" ? "query" : "body");

    if (!authHeader) {
        // throw new AppError("É necessário estar autenticado!", 401);
    }

    const [, token] = authHeader!.split(" ");

    try {
        const decoded: any = verify(token, SECRET_KEY!);
        request[type]["idUser"] = decoded.id;
        next();
    } catch(err) {
        console.log(err)
        // throw new AppError("É necessário estar autenticado para realizar essa operação!", 401);
    }

    
}