import {ItemDefinition, Resource, PatchRequestBody, PatchOperation} from "@azure/cosmos";
import {Task} from "../models/Task";
import {getCosmosContainer} from "../utils/cosmosDB";
import {COSMOS_DB_CONTAINER_TASKS} from "../config/cosmosConfig";

export async function insertTask(task: Task) {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);
    const {resource} = await container.items.create(task);
    return resource;
}

export async function getTasks(organizationId: string, page: string, limit: string, search: Record<string, string> | null): Promise<{
    tasks: Task[],
    total: number
}> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const pageSize = parseInt(limit);

    let query = "SELECT * FROM c WHERE c.organizationId = @organizationId";
    const parameters: { name: string, value: any }[] = [{name: "@organizationId", value: organizationId}];

    if (search && Object.keys(search).length > 0) {
        const searchClauses: string[] = [];
        for (const key in search) {
            if (Object.prototype.hasOwnProperty.call(search, key)) {
                const paramName = `@${key}`;
                searchClauses.push(`CONTAINS(LOWER(c.${key}), LOWER(${paramName}))`);
                parameters.push({name: paramName, value: search[key]});
            }
        }
        if (searchClauses.length > 0) {
            query += ` AND (${searchClauses.join(' AND ')})`;
        }
    }

    let countSearchClause = '';
    if (search && Object.keys(search).length > 0) {
        const searchClauses: string[] = [];
        for (const key in search) {
            if (Object.prototype.hasOwnProperty.call(search, key)) {
                const paramName = `@${key}`;
                searchClauses.push(`CONTAINS(LOWER(c.${key}), LOWER(${paramName}))`);
            }
        }
        if (searchClauses.length > 0) {
            countSearchClause = ` AND (${searchClauses.join(' AND ')})`;
        }
    }
    const countQuery = `SELECT VALUE COUNT(1)
                        FROM c
                        WHERE c.organizationId = @organizationId ${countSearchClause}`;
    const {resources: countResources} = await container.items.query({
        query: countQuery,
        parameters: parameters
    }).fetchAll();
    const total = countResources[0];

    query += ` ORDER BY c.createdAt DESC OFFSET ${offset} LIMIT ${pageSize}`;

    const {resources: tasks} = await container.items.query({query: query, parameters: parameters}).fetchAll();

    return {tasks, total};
}

export async function updateTask(taskId: string, organizationId: string, patchRequests: PatchRequestBody): Promise<ItemDefinition & Resource> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);

    const {resource: existing} = await container
        .item(taskId, organizationId)
        .read();

    if (!existing) {
        return null;
    }

    const {resource: updated} = await container
        .item(taskId, organizationId)
        .patch(patchRequests);

    return updated;
}

export async function deleteTask(id: string, organizationId: string): Promise<void> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);

    const {resource: existing} = await container
        .item(id, organizationId)
        .read();

    if (!existing) {
        return null;
    }

    await container
        .item(id, organizationId)
        .delete();
}

export async function bulkDeleteTasks(body: string[], organizationId: string): Promise<void> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);

    await Promise.all(body.map(async taskId => {
        try {
            await container
                .item(taskId, organizationId)
                .delete();
        } catch (error) {
            // Log the error but continue with other deletions
            console.error(`Failed to delete task ${taskId}:`, error.message);
        }
    }));
}

export async function findTask(taskId: string, organizationId: string): Promise<{ task: Task }> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);
    const {resource: task} = await container
        .item(taskId, organizationId)
        .read();

    return task;
}

export async function getTaskStatusSummary(organizationId: string, search: Record<string, string>): Promise<{
    statuses: string[],
    tasks: { status: string }[]
}> {
    const container = await getCosmosContainer(COSMOS_DB_CONTAINER_TASKS);

    // Get all possible statuses in the collection for this org (ignore search)
    const statusQuery = "SELECT DISTINCT VALUE LOWER(c.status) FROM c WHERE c.organizationId = @organizationId AND IS_DEFINED(c.status)";
    const statusParams = [{name: "@organizationId", value: organizationId}];
    const {resources: statusList} = await container.items.query({
        query: statusQuery,
        parameters: statusParams
    }).fetchAll();

    // Get filtered tasks (with search)
    let query = "SELECT c.status FROM c WHERE c.organizationId = @organizationId AND IS_DEFINED(c.status)";
    const parameters: { name: string, value: any }[] = [{name: "@organizationId", value: organizationId}];
    for (const key in search) {
        if (Object.prototype.hasOwnProperty.call(search, key)) {
            const paramName = `@${key}`;
            query += ` AND CONTAINS(LOWER(c.${key}), LOWER(${paramName}))`;
            parameters.push({name: paramName, value: search[key]});
        }
    }
    const {resources: tasks} = await container.items.query({query, parameters}).fetchAll();
    // Return all unique statuses (normalized, no duplicates)
    const statuses = Array.from(new Set(statusList.map(s => String(s).toLowerCase().replace(/\s|_/g, "_"))));

    return {statuses, tasks};
}
