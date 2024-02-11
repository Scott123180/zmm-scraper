const { programHasFilledUp } = require("../data-processor.mjs");

require("../data-processor.mjs");

describe('Program Has Filled Up Tests', () => {

    test('program has filled up', () => {
        const storedProgram = {
            "hasWaitingList": false,
            "hasRegistration": true
        };

        const newProgram = {
            "hasWaitingList": true,
            "hasRegistration": false
        };

        expect(
            programHasFilledUp(storedProgram, newProgram))
            .toBe(true);
    });
});