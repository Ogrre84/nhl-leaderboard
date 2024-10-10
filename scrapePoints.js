const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
require('dotenv').config();

const teamSchema = new mongoose.Schema({
    teamName: String,
    points: Number
});
const lastScrapeSchema = new mongoose.Schema({
    lastScrapedAt: { type: Date, default: Date.now }
});

const LastScrape = mongoose.model('LastScrape', lastScrapeSchema);

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

        // Update the existing records with new points
        for (const team of teamsPoints) {
            await Team.findOneAndUpdate(
                { teamName: team.teamName }, // Find the team by name
                { points: team.points }, // Update the points
                { upsert: true } // Create a new record if it doesn't exist
            );
        }

        console.log("Teams and points updated in MongoDB");

        // Update the last scrape time
        await LastScrape.create({ lastScrapedAt: new Date() });
        console.log("Last scrape time updated in MongoDB");

        await browser.close();
        await mongoose.connection.close();

    } catch (error) {
        console.error('Error fetching NHL points:', error);
    }
};

fetchNHLPoints();
