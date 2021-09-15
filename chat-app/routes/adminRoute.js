const router = require('express').Router()
const adminController = require('../controllers/admin/adminController');

const authHandler = require('../authHandler/auth');



var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();



router.post('/adminLogin', adminController.adminLogin);
//router.use(authHandler.adminAuth);



router.post('/saveEmail', adminController.saveEmail);
router.get('/waitList', adminController.waitList);
router.post('/sendEmail', adminController.sendEmail);
router.post('/sendSMS', adminController.sendSMS);
router.get('/referDetails/:id', adminController.referDetails);
router.get('/referList', adminController.referList);
router.post('/appLink', adminController.appLink);

router.post('/createUser', adminController.createUser);



// router.post('/uploadImage', multipartMiddleware, thematicController.uploadImage);



module.exports = router;
