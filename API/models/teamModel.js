const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    points: { type: Number, required: true }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
