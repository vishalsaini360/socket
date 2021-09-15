const router = require('express').Router()

const userController = require('../controllers/user/userController');
const authHandler = require('../authHandler/auth');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/createUser',userController.createUser)
router.post('/userLogin',userController.userLogin)
router.post('/userList',userController.userList)
router.post('/createRoom',userController.createRoom)
router.post('/roomList',userController.roomList)

module.exports = router;