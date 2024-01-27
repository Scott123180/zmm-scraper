const { scrape } = require('./scraper_client.js');

/*
sample program data object - if both hasWaitingList and hasRegistration is false, then the program should be in the past
  {
    programId: 'rs-program-id-3418',
    link: 'https://zmm.org/our-programs-2/3418/sunday-mornings-at-zen-mountain-monastery',
    title: 'Sunday Mornings at Zen Mountain Monastery',
    programDate: 'May 26, 2024',
    programLocation: 'Zen Mountain Monastery',
    hasWaitingList: false,
    hasRegistration: true
  }

*/

scrape().then(programData => {
    console.log('Scraped Data:', programData);
    // You can now use programData as needed
}).catch(error => {
    console.error('Error during scraping:', error);
});

/*
TODO:
compare with previously stored info for new information:
1. create an s3 bucket (with object versioning)
2. read previous json file from s3 bucket
3. compare current info with s3 bucket info
4. determine updates & email accordingly (past programs need not be notified)
5. write new version of s3 file
*/