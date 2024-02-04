exports.processProgramData = (newData, storedData) => {
    const updatedData = [];
    const expiredPrograms = [];
    const currentTimestamp = new Date().getTime();

    //TODO: account for timed out data - i.e. retreat page timed out
    newData.forEach(newProgram => {
        const storedProgram = storedData.find(sd => sd.programId === newProgram.programId);

        if (storedProgram) {
            // Check for status changes
            if (programHasFilledUp(storedProgram, newProgram)) {
                newProgram.filledUpTimestamp = currentTimestamp;
                newProgram.updated = true;
            }

            updatedData.push(newProgram);

        } else {
            // New program, add it to the updated list
            newProgram.firstSeenTimestamp = currentTimestamp;
            newProgram.updated = true;
            updatedData.push(newProgram);
        }
    });

    storedData.forEach(storedProgram => {
        const storedDataStillOnPage = newData.find(nd => nd.programId === storedProgram.programId);

        if (storedDataStillOnPage === undefined) {
            expiredPrograms.push(storedProgram);
        }
    });


    return { updatedData, expiredPrograms };
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

