const { scrape } = require('./scraper.js');

const programData = scrape();

console.log(programData);