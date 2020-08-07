const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getTimeline);
router.get('/login', viewController.getLogin);
router.get('/signup', viewController.getSignup);

module.exports = router;
