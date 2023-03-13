var express = require('express');
var router = express.Router();

var UserController = require('../controllers/auth');
var JadwalController = require('../controllers/jadwal');
const { validateLogin, validateRegister } = require('../validators/auth');
const { validateTambahJadwal } = require('../validators/jadwal');

// AUTH
router.post('/register', validateRegister, UserController.Register);
router.post('/login', validateLogin, UserController.Login);
router.post('/logout', UserController.Logout);
router.get('/checkSession', UserController.checkSession);

// JADWAL
router.post('/tambah-jadwal', validateTambahJadwal, JadwalController.TambahJadwal);
router.get('/ambil-semua-jadwal/:pemilikId', JadwalController.getJadwalByPemilikId);
router.get('/jadwal-detail/:custom_id/:pemilikId', JadwalController.getJadwalDetail);

module.exports = router;
