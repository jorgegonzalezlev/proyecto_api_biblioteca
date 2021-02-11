//modulo terceros
const express = require('express');

//modulo local
const { login, signin, logout } = require('../../controller/v1/login_controller');
const { validateSingup } = require('../../validator/vlogin');

const router = express.Router();

router.post('/login', login);

router.post('/signin', validateSingup, signin);   // crear cuenta

router.get('/logout', logout);

module.exports = router;
