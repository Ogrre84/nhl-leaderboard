const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }] // Array to store team references
});

const User = mongoose.model('User', userSchema);

module.exports = User;
