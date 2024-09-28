const express = require('express');
const router = express.Router();
const Team = require('../models/teamModel'); // From within the routes folder
const User = require('../models/userModel'); // Make sure the path is correct



// Route to populate NHL teams
router.post('/teams/populate', async (req, res) => {
    const teams = [
        { name: 'Anaheim Ducks' },
        { name: 'Boston Bruins' },
        { name: 'Buffalo Sabres' },
        { name: 'Calgary Flames' },
        { name: 'Carolina Hurricanes' },
        { name: 'Chicago Blackhawks' },
        { name: 'Colorado Avalanche' },
        { name: 'Columbus Blue Jackets' },
        { name: 'Dallas Stars' },
        { name: 'Detroit Red Wings' },
        { name: 'Edmonton Oilers' },
        { name: 'Florida Panthers' },
        { name: 'Los Angeles Kings' },
        { name: 'Minnesota Wild' },
        { name: 'Montreal Canadiens' },
        { name: 'Nashville Predators' },
        { name: 'New Jersey Devils' },
        { name: 'New York Islanders' },
        { name: 'New York Rangers' },
        { name: 'Ottawa Senators' },
        { name: 'Philadelphia Flyers' },
        { name: 'Pittsburgh Penguins' },
        { name: 'San Jose Sharks' },
        { name: 'Seattle Kraken' },
        { name: 'St. Louis Blues' },
        { name: 'Tampa Bay Lightning' },
        { name: 'Toronto Maple Leafs' },
        { name: 'Utah Hockey Club' },
        { name: 'Vancouver Canucks' },
        { name: 'Vegas Golden Knights' },
        { name: 'Washington Capitals' },
        { name: 'Winnipeg Jets' },
    ];

    try {
        await Team.insertMany(teams);
        res.status(201).json({ message: 'Teams inserted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// Route to fetch all teams
router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find(); // Fetch all teams from the database
        res.status(200).json(teams); // Send the teams as a response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Route to assign a team to a user
router.post('/assign', async (req, res) => {
    const { username, teamId } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure teams array exists
        if (!user.teams) {
            user.teams = []; // Initialize teams array if it doesn't exist
        }

        // Add the teamId to the user's teams
        user.teams.push(teamId);
        
        // Save the user document
        await user.save();

        res.status(200).json({ message: "Team assigned successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});



// Route to Fetch Users Teams
router.get('/user/:username/teams', async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by username
        const user = await User.findOne({ username }).populate('teams'); // Populate teams for more details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.teams); // Return the teams assigned to the user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

// Endpoint to get all teams with their points
router.get('/teams/points', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

// Endpoint to update team points
router.put('/teams/:id/points', async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;

    try {
        const team = await Team.findByIdAndUpdate(id, { points }, { new: true });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        res.status(200).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

// Endpoint to get the leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().populate('teams'); // Populate user teams
        const leaderboard = users.map(user => {
            const totalPoints = user.teams.reduce((total, team) => total + team.points, 0);
            return {
                username: user.username,
                points: totalPoints
            };
        });

        // Sort leaderboard by points in descending order
        leaderboard.sort((a, b) => b.points - a.points);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});


module.exports = router;
