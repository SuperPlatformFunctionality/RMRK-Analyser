const express = require('express');
const UserCheckMiddleWare = require("../middlewares/UserCheckMiddleWare");
const UserController = require('../controller/UserController.js');

const router = express.Router();
router.post('/getallnfts', UserCheckMiddleWare.checkUserAddress, UserController.getAllNFTsOfAddress);


module.exports = router
