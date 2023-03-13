const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Sessions = mongoose.model('sessions', {
     _id: {
          type: String,
     },
     expires: {
          type: Date,
     },
     session: {
          type: String,
     },
});
module.exports = Sessions;
