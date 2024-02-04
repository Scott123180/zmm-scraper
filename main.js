require('dotenv').config();

const { scrape } = require('./scraper-client.js');
const { processProgramData } = require('./data-processor.js');
const S3StorageClient = require('./S3StorageClient');
const LocalFileSystemClient = require('./LocalFileSystemClient');

let storageClient;

if (process.env.NODE_ENV === 'local') {
  console.log("local FS")
  storageClient = new LocalFileSystemClient();
} else {
  console.log("aws s3")
  storageClient = new S3StorageClient();
}

async function main() {
  scrape()
    .then(programData => {

      //download data from S3
      const storedData = storageClient.download();
      console.log("read stored data!")

      storedData.then(sd => {
        const { updatedData, expiredPrograms } = processProgramData(programData, sd);
        console.log("Updated Data:", updatedData);
        console.log("Expired Programs:", expiredPrograms);
      });
    }).catch(error => {
      console.error('Error during scraping:', error);
      //send an error email
    });

}

main();
/*
TODO:
compare with previously stored info for new information:
1. create an s3 bucket (with object versioning)
2. read previous json file from s3 bucket
3. compare current info with s3 bucket info
4. determine updates & email accordingly (past programs need not be notified)
5. write new version of s3 file
*/