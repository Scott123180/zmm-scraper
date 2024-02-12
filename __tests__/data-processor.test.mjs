import { programHasFilledUp } from '../data-processor.mjs';

describe('programHasFilledUp', () => {
  test('returns true when storedProgram has registration and newProgram has waiting list', () => {
    const storedProgram = { hasRegistration: true };
    const newProgram = { hasWaitingList: true };
    expect(programHasFilledUp(storedProgram, newProgram)).toBe(true);
  });

  test('returns false when conditions are not met', () => {
    const storedProgram = { hasRegistration: false };
    const newProgram = { hasWaitingList: true };
    expect(programHasFilledUp(storedProgram, newProgram)).toBe(false);
  });
});

