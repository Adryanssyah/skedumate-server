// controllers/register.js
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const Jadwal = require('../model/Jadwal');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
require('../utils/db');

const Register = async (req, res) => {
     const saltRounds = 10;
     req.body.password = await bcrypt.hash(req.body.password, saltRounds);
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          res.send(errors);
     } else {
          User.insertMany(req.body, (error, result) => {
               res.send('success');
          });
     }
};

const Login = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          res.send(errors);
     } else {
          try {
               const user = await User.findOne({ email: req.body.email });
               if (user) {
                    const cmp = await bcrypt.compare(req.body.password, user.password);
                    if (cmp) {
                         res.send({
                              sessionId: req.session.id,
                              session: req.session,
                              user: {
                                   id: (req.session.userId = user._id),
                                   email: (req.session.email = user.email),
                                   namaDepan: (req.session.namaDepan = user.namaDepan),
                                   namaBelakang: (req.session.namaBelakang = user.namaBelakang),
                                   tema: (req.session.tema = user.tema),
                                   jadwal: (req.session.jadwal = user.jadwal),
                              },
                         });
                    } else {
                         const errors = {
                              errors: [
                                   {
                                        param: 'password',
                                        msg: 'Email dan password tidak sesuai!',
                                   },
                              ],
                         };
                         res.send(errors);
                    }
               } else {
                    res.send('Wrong username or password.');
               }
               req.session.email = req.body.email;
          } catch (error) {
               console.log(error);
               res.status(500).send('Internal Server error Occured');
          }
     }
};

const checkSession = (req, res) => {
     if (req.session.email) {
          const user = {
               id: req.session.userId,
               email: req.session.email,
               namaDepan: req.session.namaDepan,
               namaBelakang: req.session.namaBelakang,
               tema: req.session.tema,
               jadwal: req.session.jadwal,
          };
          res.send(user);
     } else {
          res.send(false);
     }
};

const Logout = (req, res) => {
     req.session.destroy((err) => {
          if (err) throw err;
          res.send('logout');
     });
};

const ambilNama = async (req, res) => {
     try {
          const user = await User.findOne({ _id: req.body._id });
          res.status(200).send(user.namaDepan + ' ' + user.namaBelakang);
     } catch (err) {
          console.error(err);
          res.status(500).send({ message: 'Terjadi kesalahan ' });
     }
};

const checkAnggota = async (req, res) => {
     const custom_id = req.body.custom_id;
     const _id = req.body._id;
     try {
          const jadwal = await Jadwal.findOne({ custom_id });

          if (jadwal.pemilik.equals(_id)) {
               res.status(200).send({ permision: true, role: 'owner', jenis: jadwal.jenis });
               return;
          } else if (!jadwal.pemilik.equals(_id) && jadwal.jenis === 'private') {
               res.status(200).send({ permision: false, jenis: jadwal.jenis });
               return;
          }

          const peserta = jadwal.peserta.find((item) => item.userId.equals(_id));

          if (peserta) {
               const { role } = peserta;
               res.status(200).send({ permision: true, role, jenis: jadwal.jenis });
          } else {
               res.status(200).send({ permision: false, jenis: jadwal.jenis });
          }
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

const getAnggota = async (req, res) => {
     try {
          const data = req.body;
          const users = await User.find({ _id: { $in: data.map((d) => d.userId) } }, 'namaDepan namaBelakang _id tema');
          const newData = data.map((d) => {
               const user = users.find((u) => u._id.toString() === d.userId);
               return {
                    ...d,
                    tema: user.tema,
                    namaDepan: user.namaDepan,
                    namaBelakang: user.namaBelakang,
                    initials: user.namaDepan.match(/(\b\S)?/g).join('') + user.namaBelakang.match(/(\b\S)?/g).join(''),
               };
          });

          res.status(200).json(newData);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
};

const getUser = async (req, res) => {
     const user = await User.findOne({ _id: req.body._id });
     res.status(200).send(user);
};

module.exports = {
     Register,
     Login,
     Logout,
     checkSession,
     ambilNama,
     checkAnggota,
     getAnggota,
     getUser,
};
