import express from 'express';
import {paging, save, remove} from '../controllers/person';

const router = express.Router();

router.get('/list', paging);
router.post('/', save);
router.delete('/', remove);

export default router;