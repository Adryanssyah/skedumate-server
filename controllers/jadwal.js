const { v4: uuidv4 } = require('uuid');
const Jadwal = require('../model/Jadwal');
const User = require('../model/User');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

// ADDON FUNCTION
function getNowTime(now) {
     now.setHours(now.getHours() + 7);
     let dateNow = now.toISOString();
     return dateNow;
}

const updateJadwalUser = async (jadwalId, pemilik) => {
     try {
          const user = await User.findOne({ _id: pemilik });
          user.jadwal.push(jadwalId);
          await user.save();
     } catch (error) {
          console.error(`Terjadi kesalahan saat menambahkan ID jadwal ${jadwalId} ke dokumen user ${pemilik}: ${error.message}`);
     }
};

const tambahAnggota = async (jadwalId, pemilik) => {
     try {
          const jadwal = await Jadwal.findOne({ _id: jadwalId });
          jadwal.peserta.push({
               userId: pemilik,
               role: 'Anggota',
          });
          await jadwal.save();
     } catch (error) {
          console.error(`Terjadi kesalahan saat menambahkan ID user ${jadwalId} ke dokumen jadwal ${pemilik}: ${error.message}`);
     }
};

// JADWALS
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
               await updateJadwalUser(jadwal._id, pemilik);

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
     const jadwalIds = req.body;
     try {
          const jadwals = await Jadwal.find({ _id: { $in: jadwalIds } });
          const modifiedJadwals = jadwals.map((jadwal) => {
               return {
                    _id: jadwal._id,
                    custom_id: jadwal.custom_id,
                    pemilik: jadwal.pemilik,
                    jenis: jadwal.jenis,
                    namaJadwal: jadwal.nama_jadwal,
               };
          });

          res.status(200).json(modifiedJadwals);
          console.log(modifiedJadwals);
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

const getJadwalKosong = async (req, res) => {
     try {
          const jadwal = await Jadwal.findOne({ custom_id: req.params.jadwal_id });

          const hari = jadwal.hari;
          const hariList = Object.keys(hari);

          let jadwalKosong = {};

          for (let i = 0; i < hariList.length; i++) {
               const hariIni = hariList[i];
               const kegiatan = hari[hariIni].kegiatan;

               let waktuKosong = ['00:00 - 24:00'];

               for (let j = 0; j < kegiatan.length; j++) {
                    const start = kegiatan[j].start;
                    const end = kegiatan[j].end;

                    for (let k = 0; k < waktuKosong.length; k++) {
                         const waktu = waktuKosong[k].split(' - ');

                         if (start > waktu[0] && end < waktu[1]) {
                              const waktu1 = waktu[0];
                              const waktu2 = waktu[1];
                              waktuKosong.splice(k, 1, `${waktu1} - ${start}`, `${end} - ${waktu2}`);
                         } else if (start <= waktu[0] && end >= waktu[1]) {
                              waktuKosong.splice(k, 1);
                              k--;
                         } else if (start <= waktu[0] && end > waktu[0] && end <= waktu[1]) {
                              const waktu2 = waktu[1];
                              waktuKosong.splice(k, 1, `${end} - ${waktu2}`);
                         } else if (start >= waktu[0] && start < waktu[1] && end >= waktu[1]) {
                              const waktu1 = waktu[0];
                              waktuKosong.splice(k, 1, `${waktu1} - ${start}`);
                         }
                    }
               }

               jadwalKosong[hariIni] = waktuKosong;
          }
          res.json({ jadwalKosong });
     } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
     }
};

const getKelas = async (req, res) => {
     try {
          const kelas = await Jadwal.find({ _id: req.params.jadwal_id });
          res.send(kelas[0].kelas);
     } catch (error) {}
};

const addKelas = async (req, res) => {
     try {
          const { id, dataKelas } = req.body;
          Jadwal.findByIdAndUpdate(id, { kelas: dataKelas }, { new: true, useFindAndModify: false }, (err, result) => {
               if (err) {
                    // console.log(err);
               } else {
                    // console.log(result);
               }
          });
          res.status(200).send('Berhasil meyimpan!');
     } catch (error) {
          res.status(500).json({
               success: false,
               message: 'Terjadi kesalahan saat menambahkan jadwal',
               error: error.message,
          });
     }
};

const addKegiatan = async (req, res) => {
     const errors = validationResult(req);
     const { start, end, title, kelas, hari, deskripsi, maker, editor, _id } = req.body;
     if (!errors.isEmpty()) {
          res.send(errors);
     } else {
          try {
               const kegiatanBaru = {
                    id: uuidv4(),
                    start,
                    end,
                    title,
                    kelas: kelas != '' ? kelas : '',
                    deskripsi,
                    maker: mongoose.Types.ObjectId(maker),
                    editor: mongoose.Types.ObjectId(editor),
                    date: getNowTime(new Date()),
               };
               const jadwal = await Jadwal.findByIdAndUpdate(
                    _id,
                    {
                         $push: {
                              [`hari.${hari}.kegiatan`]: kegiatanBaru,
                         },
                    },
                    { new: true }
               );
               res.status(200).send(jadwal);
          } catch (error) {
               console.error(error);
               res.status(500).send(error.message);
          }
     }
};

const editKegiatan = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          res.send(errors);
     } else {
          try {
               const { id, start, end, title, kelas, _id, hari, editor, maker, deskripsi } = req.body;
               const dataKegiatan = {
                    id,
                    start,
                    end,
                    title,
                    kelas: kelas != '' ? kelas : '',
                    deskripsi,
                    maker: mongoose.Types.ObjectId(maker),
                    editor: mongoose.Types.ObjectId(editor),
                    date: getNowTime(new Date()),
               };

               const result = await Jadwal.findOneAndUpdate({ _id: _id, [`hari.${hari}.kegiatan.id`]: id }, { $set: { [`hari.${hari}.kegiatan.$`]: dataKegiatan } }, { new: true });

               res.status(200).send(result.hari[hari]);
          } catch (err) {
               console.error(err);
               res.status(500).send({ message: 'Terjadi kesalahan saat mengupdate kegiatan' });
          }
     }
};

const hapusKegiatan = async (req, res) => {
     try {
          const { _id, hari, id } = req.body;

          const jadwal = await Jadwal.findByIdAndUpdate(
               _id,
               {
                    $pull: {
                         [`hari.${hari}.kegiatan`]: { id: id },
                    },
               },
               { new: true }
          );
          res.status(200).send(jadwal.hari[hari].kegiatan);
     } catch (error) {
          console.error(error);
          res.status(500).send(error.message);
     }
};

const gabung = async (req, res) => {
     const jadwal = await Jadwal.findOne({ _id: req.body._id });
     const response = {
          error: false,
          msg: '',
     };
     if (jadwal.password === req.body.password) {
          await updateJadwalUser(mongoose.Types.ObjectId(req.body._id), mongoose.Types.ObjectId(req.body.userId));
          await tambahAnggota(mongoose.Types.ObjectId(req.body._id), mongoose.Types.ObjectId(req.body.userId));
     } else {
          response.error = true;
          response.msg = 'Password tidak cocok!';
          res.send(response);
     }
};

module.exports = {
     TambahJadwal,
     getJadwalByPemilikId,
     getJadwalDetail,
     getKelas,
     addKelas,
     getJadwalKosong,
     addKegiatan,
     editKegiatan,
     hapusKegiatan,
     gabung,
};
