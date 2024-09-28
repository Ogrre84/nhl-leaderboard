const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    points: { type: Number, default: 0 } // Add this line for points
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
