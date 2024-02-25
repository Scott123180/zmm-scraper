//import dotenv from 'dotenv';
import { scrape } from './scraper-client.mjs';
import { createNewSaveData, processProgramData } from './data-processor.mjs';
import S3StorageClient from './S3StorageClient.mjs';
import { composeAndSendEmail } from './email-client.mjs';

const storedProgramDataFileKey = "programData.json"
const storedEmailFileKey = "emails.json"

let storageClient = new S3StorageClient();

const main = async () => {
  const programData = await scrape();

  // download data from S3
  const storedProgramData = await storageClient.download(storedProgramDataFileKey);
  const storedEmails = await storageClient.download(storedEmails);
  console.log("read stored data!");

  // Process the program data
  const { newPrograms, waitlistedPrograms, expiredPrograms } = await processProgramData(programData, storedProgramData);
  console.log("New Programs:", newPrograms);
  console.log("Waitlisted Programs:", waitlistedPrograms);
  console.log("Expired Programs:", expiredPrograms);

  // Generate and send emails if there are any updates
  if (newPrograms.length > 0 || waitlistedPrograms.length > 0 || expiredPrograms.length > 0) {
    await composeAndSendEmail(storedEmails, newPrograms, waitlistedPrograms, expiredPrograms);

    //upload new file to S3
    const newSaveData = createNewSaveData(storedProgramData, newPrograms, waitlistedPrograms, expiredPrograms);

    console.log("new save data")
    console.log(JSON.stringify(newSaveData))
    await storageClient.upload(newSaveData)
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