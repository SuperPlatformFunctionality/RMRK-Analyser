import express from 'express'
import RmrkController from '../controller/RmrkController.js'

const router = express.Router();
router.post('/test', RmrkController.getDetail);


export default router
