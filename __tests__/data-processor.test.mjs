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
  /*

  tests:
  1. remove expired programs
  2. removing waitlisted programs & adding back new info
  3. adding new programs
  */

});