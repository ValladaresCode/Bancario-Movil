import { Router } from 'express';
import {
  addFavorite,
  listFavorites,
  updateFavorite,
  deleteFavorite,
  transferFromFavorite
} from './favorite.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateClientRole } from '../../middlewares/validate-ClientRole.js';

const router = Router();

router.post('/', validateJWT, validateClientRole, addFavorite);
router.get('/', validateJWT, listFavorites);
router.put('/:id', validateJWT, updateFavorite);
router.delete('/:id', validateJWT, deleteFavorite);
router.post('/:id/transfer', validateJWT, transferFromFavorite);

export default router;
