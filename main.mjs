import dotenv from 'dotenv';
import { scrape } from './scraper-client.mjs';
import { processProgramData } from './data-processor.mjs';
import S3StorageClient from './S3StorageClient.mjs';
import LocalFileSystemClient from './LocalFileSystemClient.mjs';
import { composeAndSendEmail } from './email-client.mjs';

dotenv.config();

let storageClient;

if (process.env.NODE_ENV === 'local') {
  console.log("local FS")
  storageClient = new LocalFileSystemClient();
} else {
  console.log("aws s3")
  storageClient = new S3StorageClient();
}

const main = async () => {
  try {
    const programData = await scrape();

    // download data from S3
    const storedData = await storageClient.download();
    console.log("read stored data!");

    // Process the program data
    const { newPrograms, waitlistedPrograms, expiredPrograms } = await processProgramData(programData, storedData);
    console.log("New Programs:", newPrograms);
    console.log("Waitlisted Programs:", waitlistedPrograms);
    console.log("Expired Programs:", expiredPrograms);

    // Generate and send emails if there are any updates
    if(newPrograms.length > 0 || waitlistedPrograms.length > 0 || expiredPrograms.length > 0){
      await composeAndSendEmail("me@scotthansen.io", newPrograms, waitlistedPrograms, expiredPrograms);
    }
  } catch (error) {
    console.error('Error during operation:', error);
    throw error; 
    // Optionally, send an error email to yourself
    // await composeAndSendEmail("your_email", "Error in Lambda Execution", error.toString());
  }
};

export default main;
/*
TODO:
4. determine updates & email accordingly (past programs need not be notified)
5. write new version of s3 file
- if I'm up for it, create a user preferences object and choose to subscribe to different types of updates 
(i.e. maybe) I don't care about sunday morning registration
*/