import { programHasFilledUp, createNewSaveData } from '../data-processor.mjs';

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
    const storedPrograms = [storedProgram1, storedProgram2, storedProgram3];

    const expiredPrograms = [storedProgram2, storedProgram3];

    expect(
      createNewSaveData(storedPrograms, [], [], expiredPrograms))
      .toEqual([storedProgram1]);
  });

  test('removes waitlisted programs and adds back new info', () => {
    const storedPrograms = [storedProgram1, storedProgram2, storedProgram3];

    const expectedPrograms = [storedProgram3, newWaitlistedProgram1, newWaitlistedProgram2];

    expect(
      createNewSaveData(storedPrograms, [], [newWaitlistedProgram1, newWaitlistedProgram2], []))
      .toEqual(expectedPrograms);
  });

  test('adds new programs', () => {
    const expectedPrograms = [storedProgram1, storedProgram2, storedProgram3, newProgram1, newProgram2];

    expect(createNewSaveData(
      [storedProgram1, storedProgram2, storedProgram3],
      [newProgram1, newProgram2],
      [],
      []))
      .toEqual(expectedPrograms);
  })
});

const storedProgram1 = {
  "programId": "rs-program-id-3310",
  "link": "https://zmm.org/our-programs-2/3310/beginning-instruction-on-wednesday-evenings-at-zen-mountain-monastery-winter-schedule",
  "title": "Beginning Instruction on Wednesday Evenings at Zen Mountain Monastery (winter schedule)",
  "programDate": "February 14, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510809,
  "hasWaitingList": false,
  "hasRegistration": true
};
const storedProgram2 = {
  "programId": "rs-program-id-3443",
  "link": "https://zmm.org/our-programs-2/3443/ecosattva-retreat-online",
  "title": "Ecosattva Retreat (Online)",
  "programDate": "February 17, 2024",
  "programLocation": "Online (Zoom link in registration email)",
  "firstSeenTimestamp": 1707008510809,
  "hasWaitingList": false,
  "hasRegistration": true
};
const storedProgram3 = {
  "programId": "rs-program-id-3440",
  "link": "https://zmm.org/our-programs-2/3440/ecosattva-retreat",
  "title": "Ecosattva Retreat",
  "programDate": "February 17, 2024",
  "programLocation": "Zen Center of New York City",
  "firstSeenTimestamp": 1707008510809,
  "hasWaitingList": false,
  "hasRegistration": true
};

const newWaitlistedProgram1 = {
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
const newWaitlistedProgram2 = {
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

const newProgram1 = {
  "programId": "rs-program-id-3315",
  "link": "https://zmm.org/our-programs-2/3315/beginning-instruction-on-sunday-mornings-at-zen-mountain-monastery",
  "title": "Beginning Instruction on Sunday Mornings at Zen Mountain Monastery",
  "programDate": "February 18, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510810,
  "hasWaitingList": false,
  "hasRegistration": true
};
const newProgram2 = {
  "programId": "rs-program-id-3307",
  "link": "https://zmm.org/our-programs-2/3307/sunday-mornings-at-zen-mountain-monastery",
  "title": "Sunday Mornings at Zen Mountain Monastery",
  "programDate": "February 18, 2024",
  "programLocation": "Zen Mountain Monastery",
  "firstSeenTimestamp": 1707008510810,
  "hasWaitingList": false,
  "hasRegistration": true
};