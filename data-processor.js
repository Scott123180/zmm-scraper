exports.processProgramData = (scraperData, storedData) => {
    const newPrograms = [];
    const waitlistedPrograms = [];
    const expiredPrograms = [];
    const currentTimestamp = new Date().getTime();

    //TODO: account for timed out data - i.e. retreat page timed out
    scraperData.forEach(scrapedProgram => {
        const storedProgram = storedData.find(sd => sd.programId === scrapedProgram.programId);

        if (storedProgram && programHasFilledUp(storedProgram, scrapedProgram)) {
            // Check for status changes
            scrapedProgram.filledUpTimestamp = currentTimestamp;
            waitlistedPrograms.push(scrapedProgram);
        } else {
            // New program, add it to the updated list
            scrapedProgram.firstSeenTimestamp = currentTimestamp;
            newPrograms.push(scrapedProgram);
        }
    });

    storedData.forEach(storedProgram => {
        const storedDataStillOnPage = scraperData.find(nd => nd.programId === storedProgram.programId);

        if (storedDataStillOnPage === undefined) {
            expiredPrograms.push(storedProgram);
        }
    });


    return { newPrograms, waitlistedPrograms, expiredPrograms };
}

exports.generateUpdateContent = (updated, expiredPrograms) => {
    /*create the content that will be sent out in mail
     new programs: {program title, location, date, link}
     waitlisted programs: {program title, location, link, original post date, how long it took to fill}
     expired programs: {program title, location, date, original post date, how long was on website}
    */
}

exports.createNewSaveData = (updatedData, expiredPrograms) => {
    //generate the new file that will be saved to s3
}

function programHasFilledUp(storedProgram, newProgram) {
    return storedProgram.hasWaitingList === false && storedProgram.hasRegistration === true &&
        newProgram.hasWaitingList === true && newProgram.hasRegistration === false;
}

