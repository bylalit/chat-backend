const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  image: {
    type: String,  // URL ya file path store karne ke liye
    default: ''    // Agar user image nahi upload kare to empty
  },
  bio: {
    type: String,
    default: 'Hi Everyone, I am Using ChatApp'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
