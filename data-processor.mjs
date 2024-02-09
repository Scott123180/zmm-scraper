export async function processProgramData(scraperDataPromise, storedDataPromise) {
    const scraperData = await scraperDataPromise;
    const storedData = await storedDataPromise;

    const newPrograms = [];
    const waitlistedPrograms = [];
    const expiredPrograms = [];
    const currentTimestamp = new Date().getTime();

    scraperData.forEach(scrapedProgram => {
        const storedProgram = storedData.find(sd => sd.programId === scrapedProgram.programId);

        if (storedProgram && programHasFilledUp(storedProgram, scrapedProgram)) {
            const shallowCopy = Object.assign({}, storedProgram);

            shallowCopy.filledUpTimestamp = currentTimestamp;
            waitlistedPrograms.push(shallowCopy);
        } else if (storedProgram === undefined) {
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

export function createNewSaveData(storedData, newPrograms, waitlistedPrograms, expiredPrograms) {
    let combinedList = [...storedData];

    //remove the expired programs from the combined list
    combinedList = combinedList.filter(listElement => {
        const foundExpiredProgram = expiredPrograms.find(expiredProgram => expiredProgram.programId === listElement.programId);

        return foundExpiredProgram === undefined;
    });

    //remove the original waitlisted program info so we can add the new updates to the stored data
    combinedList = combinedList.filter(listElement => {
        const foundWaitlistedProgram = waitlistedPrograms.find(waitlistedProgram => waitlistedProgram.programId === listElement.programId);

        return foundWaitlistedProgram === undefined;
    });

    combinedList = combinedList.concat(waitlistedPrograms);
    combinedList = combinedList.concat(newPrograms);

    return combinedList;
}

function programHasFilledUp(storedProgram, newProgram) {
    return (storedProgram.hasWaitingList === false 
    && storedProgram.hasRegistration === true 
    && newProgram.hasWaitingList === true 
    && newProgram.hasRegistration === false);
}

