import express from 'express'
import RmrkController from '../controller/RmrkController.js'

const router = express.Router();
router.post('/status/base', RmrkController.getBaseObj);
router.post('/status/collection',  RmrkController.getCollectionObj);
router.post('/status/nft',  RmrkController.getNFTObj);

export default router
