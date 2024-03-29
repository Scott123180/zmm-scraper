import axios from 'axios';
import { load } from 'cheerio';

const url = 'https://zmm.org/all-programs/';

export async function scrape(event) {
    const { data } = await axios.get(url);
    const $ = load(data);


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
            return { programId, link, title, programDate, programLocation };
        }
    }).get()
        .filter(item => item); //filter out undefined items (where link was seen)

    // For each program link, check the specific program page
    const programDetailsPromises = programData.map(async program => {
        const details = await checkProgramPage(program.link);
        return { ...program, ...details };
    });

    // Wait for all the program page checks to complete
    const detailedProgramData = await Promise.all(programDetailsPromises);

    return detailedProgramData;
};

async function checkProgramPage(url, retries = 2, backoff = 300) {
    try {
        await randomDelay(100);

        const { data } = await axios.get(url, {timeout : 10_000});
        // If the request is successful, return the data

        const $ = load(data);

        // Check for a waiting list or registration button
        const waitingListButton = $('.rs-registration-wait-list').length > 0;
        const registrationButton = $('.rs-registration-open').length > 0;

        return {
            hasWaitingList: waitingListButton,
            hasRegistration: registrationButton,
        };
    } catch (error) {
        console.log(error);
        if (retries > 0) {
            // Wait for a bit before retrying
            await new Promise(resolve => setTimeout(resolve, backoff));
            // Recursive call with decremented retries
            return await checkProgramPage(url, retries - 1, backoff * 2);
        } else {
            // If all retries fail, return an error object
            return { error: `Failed to fetch page: ${url}` };
        }
    }
}

// Function to wait for a random amount of time
function randomDelay(maxDelay) {
  // Generate a random delay between minDelay and maxDelay milliseconds
  const delay = Math.floor(Math.random() * maxDelay);
  return new Promise(resolve => setTimeout(resolve, delay));
}