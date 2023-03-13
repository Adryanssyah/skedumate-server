const { check, body, validationResult } = require('express-validator');
const Jadwal = require('../model/Jadwal');

const validateTambahJadwal = [
     check('nama_jadwal').isLength({ min: 1 }).withMessage('Silahkan isi nama jadwal'),

     check('password').if(check('jenis').equals('public')).isLength({ max: 8, min: 1 }).withMessage('Jika ingin menngelola bersama, password harus diisi'),
];

module.exports = {
     validateTambahJadwal,
};
