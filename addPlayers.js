const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('./API/models/playerModel'); // Adjust the path as needed

dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        addPlayers();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

async function addPlayers() {
    const players = [
        { name: 'Dad' },
        { name: 'Mom' },
        { name: 'Savi' },
        { name: 'Logan' },
        { name: 'Kaden' },
        { name: 'Kieran' }
    ];

    try {
        await Player.insertMany(players);
        console.log('Players added successfully');
    } catch (error) {
        console.error('Error adding players:', error);
    } finally {
        mongoose.connection.close(); // Close the connection after the operation
    }
}
