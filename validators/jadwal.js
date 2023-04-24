const { check, body, validationResult } = require('express-validator');
const Jadwal = require('../model/Jadwal');

const validateTambahJadwal = [
     check('nama_jadwal').isLength({ min: 1 }).withMessage('Silahkan isi nama jadwal'),

     check('password').if(check('jenis').equals('public')).isLength({ max: 8, min: 1 }).withMessage('Jika ingin mengelola bersama, password harus diisi'),
];

const validateTambahKegiatan = [
     check('title').isLength({ min: 1 }).withMessage('Nama kegiatan diperlukan'),
     check('start').isLength({ min: 1 }).withMessage('Jam mulai diperlukan'),
     check('end').isLength({ min: 1 }).withMessage('Jam selesai diperlukan'),
];

module.exports = {
     validateTambahJadwal,
     validateTambahKegiatan,
};
