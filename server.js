const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nhlRoutes = require('./api/routes/nhlRoutes'); // Adjust path as needed
const userRoutes = require('./api/routes/userRoutes'); // Adjust path as necessary


		  

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

app.use(express.static('public'));


// Use the nhlRoutes
app.use('/api', nhlRoutes); // This line routes requests to /api/teams/populate
// Use the userRoutes
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
