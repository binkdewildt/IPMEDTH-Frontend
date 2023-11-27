import type { Config } from "jest";

const config: Config = {
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    coverageDirectory: 'coverage',
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
    }
}

export default config;