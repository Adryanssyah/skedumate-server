var express = require('express');
var router = express.Router();

var UserController = require('../controllers/auth');
var JadwalController = require('../controllers/jadwal');
const { validateLogin, validateRegister } = require('../validators/auth');
const { validateTambahJadwal, validateTambahKegiatan, validateEditKegiatan } = require('../validators/jadwal');

// AUTH
router.post('/register', validateRegister, UserController.Register);
router.post('/login', validateLogin, UserController.Login);
router.post('/logout', UserController.Logout);
router.get('/checkSession', UserController.checkSession);
router.post('/ambil-nama', UserController.ambilNama);
router.post('/check-anggota', UserController.checkAnggota);
router.post('/get-anggota', UserController.getAnggota);
router.post('/get-user', UserController.getUser);

// JADWAL
router.post('/tambah-jadwal', validateTambahJadwal, JadwalController.TambahJadwal);
router.post('/ambil-semua-jadwal', JadwalController.getJadwalByPemilikId);
router.get('/jadwal-detail/:custom_id/:pemilikId', JadwalController.getJadwalDetail);
router.get('/ambil-kelas/:jadwal_id', JadwalController.getKelas);
router.get('/jadwal-kosong/:jadwal_id', JadwalController.getJadwalKosong);
router.post('/tambah-kelas', JadwalController.addKelas);
router.post('/tambah-kegiatan', validateTambahKegiatan, JadwalController.addKegiatan);
router.post('/edit-kegiatan', validateTambahKegiatan, JadwalController.editKegiatan);
router.post('/hapus-kegiatan', JadwalController.hapusKegiatan);
router.post('/gabung', JadwalController.gabung);

module.exports = router;
