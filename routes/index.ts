import { validateAuthentication } from '../app/middleware/validateAuthentication';
import { Router } from "express";
import { MesasController } from "../modules/mesas"
import { PersonagensController } from "../modules/personagens"
import { UsuarioController } from "../modules/usuarios"

const routes = Router();

// Usuario routes

const user = new UsuarioController(); 

routes.post('/user/social-login', user.authEmail);
routes.post('/user/signed', user.validateAuth);
routes.post('/user/register', user.register);

// Adição de middleware

routes.use(validateAuthentication);

// Mesas routes

const mesas = new MesasController();

routes.get('/mesas', mesas.getMesas);
routes.get('/mesas/by-id', mesas.getByIdMesas);
routes.post('/mesas', mesas.newMesas);
routes.put('/mesas', mesas.updateMesas);

// Personagens routes

const personagens = new PersonagensController();

routes.get('/personagens', personagens.getPersonagem);
routes.get('/personagens/by-id', personagens.getPersonagemById);
routes.post('/personagens', personagens.newPersonagem);
routes.put('/personagens', personagens.updatePersonagem);


export default routes;