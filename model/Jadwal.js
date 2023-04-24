const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const bcrypt = require('bcryptjs');
const hari = require('../data/default');

const Jadwal = mongoose.model('jadwal', {
     custom_id: {
          type: String,
          required: true,
          unique: true,
     },
     pemilik: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
          required: true,
     },
     jenis: {
          type: String,
          enum: ['private', 'public'],
          default: 'private',
          required: true,
     },
     nama_jadwal: {
          type: String,
          required: true,
     },
     password: {
          type: String,
          required: function () {
               return this.jenis === 'public';
          },
     },
     hari: {
          type: Object,
          default: hari,
     },
     peserta: {
          type: Array,
          default: [],
     },

     kelas: {
          type: Array,
          default: null,
     },
});

module.exports = Jadwal;
