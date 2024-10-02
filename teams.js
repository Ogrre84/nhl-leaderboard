const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: String,
    points: Number
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
