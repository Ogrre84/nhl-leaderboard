const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // other fields...
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
