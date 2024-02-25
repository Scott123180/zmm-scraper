import { programHasFilledUp, createNewSaveData, processProgramData } from '../src/data-processor.mjs';

describe('processProgramData', () => {
  test('should correctly process data for new programs', async () => {
    // Mock scraperDataPromise and storedDataPromise with the given data
    const scraperDataPromise = Promise.resolve([program4_raw_scraped, program5_raw_scraped]);
    const storedDataPromise = Promise.resolve([]);

    const { newPrograms, waitlistedPrograms, expiredPrograms } = await processProgramData(scraperDataPromise, storedDataPromise);

    expect(newPrograms[0].programId).toEqual("rs-program-id-3315");
    expect(newPrograms[0].firstSeenTimestamp).toBeGreaterThan(1708809547565);
    expect(newPrograms[1].programId).toEqual("rs-program-id-3307");
    expect(newPrograms[1].firstSeenTimestamp).toBeGreaterThan(1708809547565);

    expect(waitlistedPrograms).toEqual([]);
    expect(expiredPrograms).toEqual([]);
  });
  
  test('should correctly process data for new waitlisted programs', async () => {
    // Mock scraperDataPromise and storedDataPromise with the given data
    const scraperDataPromise = Promise.resolve([program1_raw_scraped_waitlisted, program2_raw_scraped_waitlisted]);
    const storedDataPromise = Promise.resolve([program1_stored, program2_stored]);

    const { newPrograms, waitlistedPrograms, expiredPrograms } = await processProgramData(scraperDataPromise, storedDataPromise);

    expect(waitlistedPrograms[0].programId).toEqual("rs-program-id-3310");
    expect(waitlistedPrograms[0].hasRegistration).toEqual(false);
    expect(waitlistedPrograms[0].hasWaitingList).toEqual(true);
    expect(waitlistedPrograms[0].filledUpTimestamp).toBeGreaterThan(1708809547565);

    expect(waitlistedPrograms[1].programId).toEqual("rs-program-id-3443");
    expect(waitlistedPrograms[1].hasRegistration).toEqual(false);
    expect(waitlistedPrograms[1].hasWaitingList).toEqual(true);
    expect(waitlistedPrograms[1].filledUpTimestamp).toBeGreaterThan(1708809547565);

    expect(newPrograms).toEqual([]);
    expect(expiredPrograms).toEqual([]);
  });
  
  test('should correctly process data for expired programs', async () => {
    // Mock scraperDataPromise and storedDataPromise with the given data
    const scraperDataPromise = Promise.resolve([]);
    const storedDataPromise = Promise.resolve([program1_stored, program2_stored]);

    const { newPrograms, waitlistedPrograms, expiredPrograms } = await processProgramData(scraperDataPromise, storedDataPromise);

    expect(newPrograms).toEqual([]);
    expect(waitlistedPrograms).toEqual([]);
    expect(expiredPrograms).toEqual([program1_stored, program2_stored]);
  });
});

describe('programHasFilledUp', () => {
  test('returns true when storedProgram has registration and newProgram has waiting list', () => {
    const storedProgram = { hasRegistration: true };
    const newProgram = { hasWaitingList: true };
    expect(programHasFilledUp(storedProgram, newProgram)).toBe(true);
  });

  test('returns false when stored program does is already filled up', () => {
    const storedProgram = { hasRegistration: false };
    const newProgram = { hasWaitingList: true };
    expect(programHasFilledUp(storedProgram, newProgram)).toBe(false);
  });
});

describe('createNewSaveData', () => {

  test('removes expired programs', () => {
    const storedPrograms = [program1_stored, program2_stored, program3_stored];

    const expiredPrograms = [program2_stored, program3_stored];

    expect(
      createNewSaveData(storedPrograms, [], [], expiredPrograms))
      .toEqual([program1_stored]);
  });

  test('removes waitlisted programs and adds back new info', () => {
    const storedPrograms = [program1_stored, program2_stored, program3_stored];

    const expectedPrograms = [program3_stored, program1_new_waitlisted, program2_new_waitlisted];

    expect(
      createNewSaveData(storedPrograms, [], [program1_new_waitlisted, program2_new_waitlisted], []))
      .toEqual(expectedPrograms);
  });

  test('adds new programs', () => {
    const expectedPrograms = [program1_stored, program2_stored, program3_stored, program4_new, program5_new];

    expect(createNewSaveData(
      [program1_stored, program2_stored, program3_stored],
      [program4_new, program5_new],
      [],
      []))
      .toEqual(expectedPrograms);
  })
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

const program1_raw_scraped_waitlisted = {
  "programId": "rs-program-id-3310",
  "link": "https://zmm.org/our-programs-2/3310/beginning-instruction-on-wednesday-evenings-at-zen-mountain-monastery-winter-schedule",
  "title": "Beginning Instruction on Wednesday Evenings at Zen Mountain Monastery (winter schedule)",
  "programDate": "February 14, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510809,
  "hasWaitingList": true,
  "hasRegistration": false
};
const program2_raw_scraped_waitlisted = {
  "programId": "rs-program-id-3443",
  "link": "https://zmm.org/our-programs-2/3443/ecosattva-retreat-online",
  "title": "Ecosattva Retreat (Online)",
  "programDate": "February 17, 2024",
  "programLocation": "Online (Zoom link in registration email)",
  "firstSeenTimestamp": 1707008510809,
  "hasWaitingList": true,
  "hasRegistration": false
};

const program1_new_waitlisted = {
  "programId": "rs-program-id-3310",
  "link": "https://zmm.org/our-programs-2/3310/beginning-instruction-on-wednesday-evenings-at-zen-mountain-monastery-winter-schedule",
  "title": "Beginning Instruction on Wednesday Evenings at Zen Mountain Monastery (winter schedule)",
  "programDate": "February 14, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510809,
  "filledUpTimestamp": 2707008510809,
  "hasWaitingList": true,
  "hasRegistration": false
};
const program2_new_waitlisted = {
  "programId": "rs-program-id-3443",
  "link": "https://zmm.org/our-programs-2/3443/ecosattva-retreat-online",
  "title": "Ecosattva Retreat (Online)",
  "programDate": "February 17, 2024",
  "programLocation": "Online (Zoom link in registration email)",
  "firstSeenTimestamp": 1707008510809,
  "filledUpTimestamp": 2707008510809,
  "hasWaitingList": true,
  "hasRegistration": false
};

const program4_raw_scraped = {
  "programId": "rs-program-id-3315",
  "link": "https://zmm.org/our-programs-2/3315/beginning-instruction-on-sunday-mornings-at-zen-mountain-monastery",
  "title": "Beginning Instruction on Sunday Mornings at Zen Mountain Monastery",
  "programDate": "February 18, 2024",
  "programLocation": "Zen Mountain Monastery",
  "hasWaitingList": false,
  "hasRegistration": true
};
const program5_raw_scraped = {
  "programId": "rs-program-id-3307",
  "link": "https://zmm.org/our-programs-2/3307/sunday-mornings-at-zen-mountain-monastery",
  "title": "Sunday Mornings at Zen Mountain Monastery",
  "programDate": "February 18, 2024",
  "programLocation": "Zen Mountain Monastery",
  "hasWaitingList": false,
  "hasRegistration": true
};

const program4_new = {
  "programId": "rs-program-id-3315",
  "link": "https://zmm.org/our-programs-2/3315/beginning-instruction-on-sunday-mornings-at-zen-mountain-monastery",
  "title": "Beginning Instruction on Sunday Mornings at Zen Mountain Monastery",
  "programDate": "February 18, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510810,
  "hasWaitingList": false,
  "hasRegistration": true
};
const program5_new = {
  "programId": "rs-program-id-3307",
  "link": "https://zmm.org/our-programs-2/3307/sunday-mornings-at-zen-mountain-monastery",
  "title": "Sunday Mornings at Zen Mountain Monastery",
  "programDate": "February 18, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510810,
  "hasWaitingList": false,
  "hasRegistration": true
};