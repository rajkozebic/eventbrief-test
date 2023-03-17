import { Router } from 'express';
import meetingsRouter from './meetings.router';

const RootRouter = Router();

RootRouter.use('/meetings', meetingsRouter);

export default RootRouter;
