const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  walletAddress: { type: String, unique: true, sparse: true },
  businessName: String,
  businessNumber: String,
  businessAssociates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model('User', userSchema);
