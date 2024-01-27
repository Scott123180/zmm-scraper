const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
    const url = 'https://zmm.org/all-programs/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Example: Get all the headlines in a page
    const headlines = $('a').map((i, el) => $(el).text()).get();
    console.log(headlines);
    return headlines;
};

