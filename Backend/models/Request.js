const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  tel: {
    type: String,
    required: true,
    trim: true
  },
  besoin: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    default: 'en attente',
    enum: ['en attente', 'traité', 'rejeté']
  },
  date_creation: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);