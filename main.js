require('dotenv').config();

const { scrape } = require('./scraper-client.js');
const { processProgramData } = require('./data-processor.js');
const S3StorageClient = require('./S3StorageClient');
const LocalFileSystemClient = require('./LocalFileSystemClient');
const { composeAndSendEmail } = require('./email-client.js');

let storageClient;

if (process.env.NODE_ENV === 'local') {
  console.log("local FS")
  storageClient = new LocalFileSystemClient();
} else {
  console.log("aws s3")
  storageClient = new S3StorageClient();
}

exports.main = () => {
  scrape()
    .then(programData => {

      //download data from S3
      const storedData = storageClient.download();
      console.log("read stored data!")

      storedData.then(sd => {
        //TODO: put in one object
        const { newPrograms, waitlistedPrograms, expiredPrograms } = processProgramData(programData, sd);
        console.log("New Programs:", newPrograms)
        console.log("Waitlisted Programs:", waitlistedPrograms);
        console.log("Expired Programs:", expiredPrograms);

        //generate emails
        if(newPrograms || waitlistedPrograms || expiredPrograms){
          composeAndSendEmail("me@scotthansen.io", newPrograms, waitlistedPrograms, expiredPrograms);
        }
      });
    }).catch(error => {
      console.error('Error during scraping:', error);
      //send an error email to me
    });

}

main();
/*
TODO:
4. determine updates & email accordingly (past programs need not be notified)
5. write new version of s3 file
- if I'm up for it, create a user preferences object and choose to subscribe to different types of updates 
(i.e. maybe) I don't care about sunday morning registration
*/