const axios = require('axios');
const cheerio = require('cheerio');

exports.scrape = async (event) => {
    const url = 'https://zmm.org/all-programs/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);


    const seenLinks = new Set(); // Set to track seen links

    // Select all parent div elements whose id starts with 'rs-program-id'
    const programData = $(`div[id^='rs-program-id']`).map((i, el) => {
        const programId = $(el).attr('id'); // Get the id of the div
        const link = $(el).find('a').attr('href'); // Find the 'a' element and get its href
        const title = $(el).find('a').text().trim(); // Find the 'a' element and get its text
        const programDate = $(el).find('.rs-program-date').text().trim(); // Find the .rs-program-date and get its text
        const programLocation = $(el).find('.rs-program-location').text().trim(); // Find the .rs-program-date and get its text

        // Check if the link has already been seen
        if (!seenLinks.has(link)) {
            seenLinks.add(link); // Mark the link as seen
            return { programId, link, title, programDate, programLocation};
        }
    }).get()
    .filter(item => item); //filter out undefined items (where link was seen)

    return programData;
};