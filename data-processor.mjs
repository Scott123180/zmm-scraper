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
    return storedData.filter(listElement => {
        //remove expired programs
        const foundExpiredProgram = expiredPrograms.find(expiredProgram => expiredProgram.programId === listElement.programId);

        return foundExpiredProgram === undefined;
    }).filter(listElement => {
        //remove the original waitlisted program info so we can add the new updates to the stored data
        const foundWaitlistedProgram = waitlistedPrograms.find(waitlistedProgram => waitlistedProgram.programId === listElement.programId);

        return foundWaitlistedProgram === undefined;
    }).concat(waitlistedPrograms)
        .concat(newPrograms);
}

export function programHasFilledUp(storedProgram, newProgram) {
    return (storedProgram.hasRegistration === true
        && newProgram.hasWaitingList === true);
}