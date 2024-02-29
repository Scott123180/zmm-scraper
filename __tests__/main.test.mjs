// main.test.js
import main from '../src/main'; // Assume your provided code is in `main.js`
import { scrape } from '../src/scraper-client.mjs';
import { createNewSaveData, processProgramData } from '../src/data-processor.mjs';
import S3StorageClient from '../src/S3StorageClient.mjs';
import { composeAndSendEmail } from '../src/email-client.mjs';

// Mocking modules
jest.mock('../src/scraper-client.mjs', () => ({
    scrape: jest.fn(),
}));
jest.mock('../src/data-processor.mjs', () => ({
    createNewSaveData: jest.fn(),
    processProgramData: jest.fn(),
}));
jest.mock('../src/S3StorageClient.mjs', () => {
    return jest.fn().mockImplementation(() => ({
        download: jest.fn(),
        upload: jest.fn(),
    }));
});
jest.mock('../src/email-client.mjs', () => ({
    composeAndSendEmail: jest.fn(),
}));


describe('should not send email', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Setup mocks with default or specific return values
    scrape.mockResolvedValue(/* mock scrape data */);
    S3StorageClient.mockImplementation(() => ({
        download: jest.fn().mockResolvedValue([]),
        upload: jest.fn()
    }));
    processProgramData.mockResolvedValue({
        newPrograms: [],
        waitlistedPrograms: [],
        expiredPrograms: [],
    });


    it('should invoke methods', async () => {
        await main();

        // Assert scrape was called
        expect(scrape).toHaveBeenCalled();

        // Assert download was called for programData.json and emails.json
        const mockS3StorageClientInstance = new S3StorageClient();

        expect(mockS3StorageClientInstance.download).toHaveBeenCalledWith("programData.json");
        expect(mockS3StorageClientInstance.download).toHaveBeenCalledWith("emails.json");

        // Assert processProgramData was called with the scraped data and downloaded program data
        expect(processProgramData).toHaveBeenCalled();

        expect(createNewSaveData).not.toHaveBeenCalled();
        expect(composeAndSendEmail).not.toHaveBeenCalled();
        expect(S3StorageClient.prototype.upload).not.toHaveBeenCalled();
    });
});

const program1_stored = {
    "programId": "rs-program-id-3310",
    "link": "https://zmm.org/our-programs-2/3310/beginning-instruction-on-wednesday-evenings-at-zen-mountain-monastery-winter-schedule",
    "title": "Beginning Instruction on Wednesday Evenings at Zen Mountain Monastery (winter schedule)",
    "programDate": "February 14, 2024",
    "programLocation": "Zen Mountain Monastery",
    "firstSeenTimestamp": 1707008510809,
    "hasWaitingList": false,
    "hasRegistration": true
};
const program2_stored = {
    "programId": "rs-program-id-3443",
    "link": "https://zmm.org/our-programs-2/3443/ecosattva-retreat-online",
    "title": "Ecosattva Retreat (Online)",
    "programDate": "February 17, 2024",
    "programLocation": "Online (Zoom link in registration email)",
    "firstSeenTimestamp": 1707008510809,
    "hasWaitingList": false,
    "hasRegistration": true
};
const program3_stored = {
    "programId": "rs-program-id-3440",
    "link": "https://zmm.org/our-programs-2/3440/ecosattva-retreat",
    "title": "Ecosattva Retreat",
    "programDate": "February 17, 2024",
    "programLocation": "Zen Center of New York City",
    "firstSeenTimestamp": 1707008510809,
    "hasWaitingList": false,
    "hasRegistration": true
};