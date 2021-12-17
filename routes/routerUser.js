import express from 'express'
import UserCheckMiddleWare from "../middlewares/UserCheckMiddleWare";
import UserController from '../controller/UserController.js'

const router = express.Router();
router.post('/getallnfts', UserCheckMiddleWare.checkUserAddress, UserController.getAllNFTsOfAddress);


export default router
