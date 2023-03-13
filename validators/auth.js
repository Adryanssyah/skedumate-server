const { check, body, validationResult } = require('express-validator');
const User = require('../model/User');
const bcrypt = require('bcryptjs');

const validateRegister = [
     body('email').custom(async (value) => {
          const duplikat = await User.findOne({ email: value });
          if (duplikat) {
               throw new Error('Email Sudah digunakan. coba yang lain!');
          }
          return true;
     }),
     check('namaDepan').isLength({ min: 1 }).withMessage('Silahkan isi nama depan Anda'),
     check('namaBelakang').isLength({ min: 1 }).withMessage('Silahkan isi nama belakang Anda'),
     check('email').isLength({ min: 1 }).withMessage('Silahkan isi email anda').isEmail().withMessage('Email yang Anda masukkan tidak valid').normalizeEmail(),

     check('password').isLength({ min: 8 }).withMessage('Password setidaknya memiliki 8 karakter'),
];

const validateLogin = [
     body('email').custom(async (value) => {
          const userAda = await User.findOne({ email: value });
          if (!userAda) {
               throw new Error('Akun tidak ditemukan');
          }
          return true;
     }),
     check('email').isLength({ min: 1 }).withMessage('Silahkan isi email anda').isEmail().withMessage('Email yang Anda masukkan tidak valid').normalizeEmail(),
     check('password').isLength({ min: 8 }).withMessage('Password setidaknya memiliki 8 karakter'),
];

module.exports = {
     validateRegister,
     validateLogin,
};
