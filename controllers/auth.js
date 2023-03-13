// controllers/register.js
const bcrypt = require('bcryptjs');
const User = require('../model/User');
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

module.exports = {
     Register,
     Login,
     Logout,
     checkSession,
};
