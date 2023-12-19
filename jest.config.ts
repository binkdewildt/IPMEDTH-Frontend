import type { Config } from "jest";
import { defaults } from 'jest-config';

const config: Config = {
    testEnvironment: "jsdom",
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    coverageDirectory: 'coverage',
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.ts",
        "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.ts"
    },
    moduleDirectories: [...defaults.moduleDirectories, 'bower_components']
}

export default config;