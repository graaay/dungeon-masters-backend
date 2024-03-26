import { Router } from "express";
import { MesasController } from "../modules/mesas"
import { PersonagensController } from "../modules/personagens"

const routes = Router();

// Mesas routes

const mesas = new MesasController();

routes.get('/mesas', mesas.getMesas);
routes.get('/mesas/by-id', mesas.getByIdMesas);
routes.post('/mesas', mesas.newMesas);
routes.put('/mesas', mesas.updateMesas);

// Personagens routes

const personagens = new PersonagensController();

routes.get('/personagens', personagens.getPersonagem);
routes.get('/personagens/ficha', personagens.abrirFichaPersonagem);
routes.get('/personagens/by-id', personagens.getPersonagemById);
routes.post('/personagens', personagens.newPersonagem);
routes.put('/personagens', personagens.updatePersonagem);


export default routes;