import { Router } from 'express';
import {
  list,
  get,
  update,
  remove,
  create,
} from '../controllers/meetings.controller';

const meetingsRouter = Router();

meetingsRouter.get('/', list);
meetingsRouter.get('/:id', get);
meetingsRouter.put('/:id', update);
meetingsRouter.delete('/', remove);
meetingsRouter.post('/', create);

export default meetingsRouter;
