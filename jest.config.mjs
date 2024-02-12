export default {
  transform: {
    '^.+\\.m?js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
  testMatch: [
    "**/__tests__/**/*.(mjs|js)", // Corrected pattern to match .mjs and .js files
    "**/?(*.)+(spec|test).(mjs|js)" // Corrected pattern to match .mjs and .js files
  ],
};

