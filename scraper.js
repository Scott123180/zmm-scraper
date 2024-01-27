const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
    const url = 'http://example.com';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Example: Get all the headlines in a page
    const headlines = $('h1').map((i, el) => $(el).text()).get();
    console.log(headlines);
    return headlines;
};

