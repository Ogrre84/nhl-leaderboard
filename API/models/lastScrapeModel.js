const mongoose = require('mongoose');

const lastScrapeSchema = new mongoose.Schema({
    lastScrapedAt: { type: Date, required: true }
});

const LastScrape = mongoose.model('LastScrape', lastScrapeSchema);

module.exports = LastScrape;
