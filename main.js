const { scrape } = require('./scraper.js');

scrape().then(programData => {
    console.log('Scraped Data:', programData);
    // You can now use programData as needed
}).catch(error => {
    console.error('Error during scraping:', error);
});