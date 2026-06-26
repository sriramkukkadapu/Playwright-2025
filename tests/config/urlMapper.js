// APP Test URL - https://restful-api.dev/

const environments = {
    dev: "https://api.restful-api.dev",
    test: "https://api.restful-api.test",
    stage: "https://api.restful-api.stage",
    prod: "https://api.restful-api"
};

// Get environment from environment variable, default to 'dev'
// Convert to lowercase to handle both uppercase and lowercase input (e.g., DEV, dev, Dev)
const env = (process.env.ENV || 'dev').toLowerCase();

// Validate environment
if (!environments[env]) {
    throw new Error(`Invalid environment: ${env}. Supported environments: ${Object.keys(environments).join(', ')}`);
}

const objectsAPI_BaseURL = `${environments[env]}/objects`;

console.log(`Using environment: ${env}`);
console.log(`Objects API Base URL: ${objectsAPI_BaseURL}`);

module.exports = { objectsAPI_BaseURL };
