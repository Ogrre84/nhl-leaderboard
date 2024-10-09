const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
require('dotenv').config();
const LastScrape = require('./models/lastScrapeModel'); // Import the model

const teamSchema = new mongoose.Schema({
    teamName: String,
    points: Number
});

const Team = mongoose.model('Team', teamSchema);

const fetchNHLPoints = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.hockey-reference.com/leagues/NHL_2025.html#stats');

        const teamsPoints = await page.evaluate(() => {
            const teams = [];
            const rows = document.querySelectorAll('table#stats tbody tr');
            rows.forEach(row => {
                const teamName = row.querySelector('td[data-stat="team_name"] a')?.innerText;
                const points = row.querySelector('td[data-stat="points"]')?.innerText;
                if (teamName && points) {
                    teams.push({ teamName, points: parseInt(points) });
                }
            });
            return teams;
        });

        console.log("Scraped Teams and Points:", teamsPoints);

        // Clear the previous data
        await Team.deleteMany({}); // Clear previous records

        // Save the scraped data to MongoDB
        const savedTeams = await Team.insertMany(teamsPoints);
        console.log("Teams and points saved to MongoDB:", savedTeams);

        // Update the last scrape time
        await LastScrape.deleteMany({}); // Clear previous last scrape records
        await LastScrape.create({ lastScrapedAt: new Date() }); // Insert new last scrape time

        await browser.close();
        await mongoose.connection.close();

    } catch (error) {
        console.error('Error fetching NHL points:', error);
    }
};

fetchNHLPoints();
