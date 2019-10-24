const common = require('./jest.config.common')
module.exports = {
    projects: [
        {
            ...common,
            runner: "@jest-runner/electron",
            testEnvironment: "@jest-runner/electron/environment",
            testMatch: ['**/tests/renderer/**/*.(spec).ts']
        }
    ]
}