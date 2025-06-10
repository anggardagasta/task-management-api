import {CosmosClient, Container} from "@azure/cosmos";
import {COSMOS_DB_ENDPOINT, COSMOS_DB_KEY, COSMOS_DB_DATABASE, COSMOS_DB_CONTAINER_TASKS, COSMOS_DB_CONTAINER_FORM_SETTINGS} from "../config/cosmosConfig";

const containers: Map<string, Container> = new Map();

export async function getCosmosContainer(containerId: string): Promise<Container> {
    if (!containers.has(containerId)) {
        if (!COSMOS_DB_ENDPOINT || !COSMOS_DB_KEY || !COSMOS_DB_DATABASE || !containerId) {
            throw new Error("Cosmos DB environment variables or container ID not set.");
        }
        const client = new CosmosClient({endpoint: COSMOS_DB_ENDPOINT, key: COSMOS_DB_KEY});
        const database = client.database(COSMOS_DB_DATABASE);
        const {container: cosmosContainer} = await database.containers.createIfNotExists({id: containerId});
        containers.set(containerId, cosmosContainer);
    }
    return containers.get(containerId)!;
}