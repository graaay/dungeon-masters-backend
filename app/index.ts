import express, { Request, Response, NextFunction } from "express";
import routes from '../routes/index'
import cors from 'cors';

const app = express();

app.use(cors({ methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"], preflightContinue: false, origin: '*', exposedHeaders: ['X-Total-Count'] }));
app.use(express.json());

app.use(routes);


export default app;