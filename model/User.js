const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-gray-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'];

function getRandomColor() {
     return colors[Math.floor(Math.random() * colors.length)];
}

const randomColor = getRandomColor();

const User = mongoose.model('users', {
     namaDepan: {
          type: String,
          required: true,
     },
     namaBelakang: {
          type: String,
          required: true,
     },
     tema: {
          type: String,
          default: randomColor,
     },
     email: {
          type: String,
     },
     password: {
          type: String,
          required: true,
     },
     jadwal: {
          type: Array,
          default: [],
     },
});

module.exports = User;
