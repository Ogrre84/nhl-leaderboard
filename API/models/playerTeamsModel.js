const mongoose = require('mongoose');

const playerTeamSchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    // Add other fields as necessary
});

const PlayerTeam = mongoose.model('PlayerTeam', playerTeamSchema);

module.exports = PlayerTeam;
