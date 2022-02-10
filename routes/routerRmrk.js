const express = require('express');
const RmrkController = require('../controller/RmrkController.js');

const router = express.Router();
router.post('/status/base', RmrkController.getBaseObj);
router.post('/status/collection',  RmrkController.getCollectionObj);
router.post('/status/nft',  RmrkController.getNFTObj);

module.exports = router
