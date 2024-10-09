const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const LastScrape = require('./models/lastScrapeModel')
require('dotenv').config();

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from /public

// Player model
const Player = require('./API/models/playerModel');

// Team model
const Team = require('./API/models/teamModel');

// PlayerTeams model
const PlayerTeams = require('./API/models/playerTeamsModel');

// API routes

// Get all players
app.get('/api/players', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get all teams
app.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Assign a team to a player
app.post('/api/playerTeams', async (req, res) => {
    const { playerId, teamId } = req.body;
    try {
        const newAssignment = new PlayerTeams({ playerId, teamId });
        await newAssignment.save();
        res.json(newAssignment);
    } catch (error) {
        console.error('Error assigning team:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get all player-team assignments
app.get('/api/playerTeams', async (req, res) => {
    try {
        const playerTeams = await PlayerTeams.find()
            .populate('playerId')
            .populate('teamId');
        res.json(playerTeams);
    } catch (error) {
        console.error('Error fetching player teams:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get the last scrape time
app.get('/api/lastScrape', async (req, res) => {
    try {
        const lastScrape = await LastScrape.findOne().sort({ lastScrapedAt: -1 }); // Get the most recent scrape time
        res.json(lastScrape);
    } catch (error) {
        console.error('Error fetching last scrape time:', error);
        res.status(500).send('Server error');
    }
});

// Remove all player-team assignments
app.delete('/api/playerTeams', async (req, res) => {
    try {
        await PlayerTeams.deleteMany({});
        res.status(200).send('All team assignments removed');
    } catch (error) {
        console.error('Error removing player teams:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
