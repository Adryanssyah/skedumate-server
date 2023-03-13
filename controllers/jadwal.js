const bcrypt = require('bcryptjs');
const Jadwal = require('../model/Jadwal');
const { validationResult } = require('express-validator');
const { nanoid } = require('nanoid');

const TambahJadwal = async (req, res) => {
     const errors = validationResult(req);
     const custom_id = nanoid(20);

     if (!errors.isEmpty()) {
          res.send(errors);
     } else {
          try {
               const { pemilik, jenis, nama_jadwal, password } = req.body;
               if (jenis !== 'private' && jenis !== 'public') {
                    jenis = 'private';
               }
               const jadwal = new Jadwal({
                    custom_id,
                    pemilik,
                    jenis,
                    nama_jadwal,
                    password,
               });

               await jadwal.save();

               res.status(201).json({
                    success: true,
                    message: 'Jadwal berhasil dibuat',
                    jadwal,
               });
          } catch (error) {
               res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan saat membuat jadwal',
                    error: error.message,
               });
          }
     }
};

const getJadwalByPemilikId = async (req, res) => {
     const pemilikId = req.params.pemilikId;
     try {
          const jadwals = await Jadwal.find({ pemilik: pemilikId });
          const modifiedJadwals = jadwals.map((jadwal) => {
               return {
                    custom_id: jadwal.custom_id,
                    pemilik: jadwal.pemilik,
                    jenis: jadwal.jenis,
                    namaJadwal: jadwal.nama_jadwal,
               };
          });
          res.status(200).json(modifiedJadwals);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

const getJadwalDetail = async (req, res) => {
     try {
          const jadwals = await Jadwal.find({ custom_id: req.params.custom_id });

          res.status(200).json(jadwals);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

module.exports = {
     TambahJadwal,
     getJadwalByPemilikId,
     getJadwalDetail,
};
