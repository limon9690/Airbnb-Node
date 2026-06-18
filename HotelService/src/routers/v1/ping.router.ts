import express from 'express';
import { pingHandler } from '../../controllers/ping.controller';

const pingRouter = express.Router();

// GET requests typically don't have a body; remove body validation so the route responds correctly
pingRouter.get('/', pingHandler);

pingRouter.get('/health', (req, res) => {
    res.status(200).send('OK');
});

export default pingRouter;