import {ItemDefinition, Resource} from "@azure/cosmos";
import {FormSetting} from "../models/FormSetting";
import {getCosmosContainer} from "../utils/cosmosDB";
import {COSMOS_DB_CONTAINER_FORM_SETTINGS} from "../config/cosmosConfig";

export async function getFormSettings(organizationId: string): Promise<FormSetting[] | null> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_FORM_SETTINGS);
    const querySpec = {
        query: "SELECT * FROM c WHERE c.organizationId = @organizationId",
        parameters: [{name: "@organizationId", value: organizationId}]
    };

    const {resources} = await container.items.query(querySpec).fetchAll();

    if (!resources || resources.length === 0) {
        return [];
    }

    return resources;
}

export async function insertFormSetting(setting: FormSetting): Promise<FormSetting> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_FORM_SETTINGS);
    const {resource} = await container.items.create(setting);
    return resource;
}

export async function updateFormSetting(id: string, setting: Partial<FormSetting>): Promise<ItemDefinition & Resource> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_FORM_SETTINGS);
    // Ensure the document exists before updating
    const {resource: existing} = await container
        .item(id, setting.organizationId)
        .read();

    if (!existing) {
        return null;
    }

    const {resource: updated} = await container
        .item(id, setting.organizationId)
        .replace({...existing, ...setting});

    return updated;
}

export async function deleteFormSetting(id: string, organizationId: string): Promise<void> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_FORM_SETTINGS);
    await container.item(id, organizationId).delete();
}
