import * as dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

// Cosmos DB Emulator connection settings for local development
export const COSMOS_DB_ENDPOINT = getEnvVar("COSMOS_DB_ENDPOINT");
export const COSMOS_DB_KEY = getEnvVar("COSMOS_DB_KEY");
export const COSMOS_DB_DATABASE = getEnvVar("COSMOS_DB_DATABASE");
export const COSMOS_DB_CONTAINER_TASKS = getEnvVar("COSMOS_DB_CONTAINER_TASKS");
export const COSMOS_DB_CONTAINER_FORM_SETTINGS = getEnvVar("COSMOS_DB_CONTAINER_FORM_SETTINGS");
