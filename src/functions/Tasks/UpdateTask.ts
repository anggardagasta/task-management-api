import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {updateTask} from "../../services/taskService";

export async function UpdateTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = await request.json() as object;

    const taskId = request.query.get('id');
    if (!taskId) {
        return {status: 400, body: "Missing taskId"};
    }

    const organizationId = request.query.get('organizationId');
    if (!organizationId) {
        return {status: 400, body: "Missing organizationId"};
    }

    let patchRequests = [];

    for (let key in body) {
        patchRequests.push({
            "op": "replace",
            "path": `/${key}`,
            "value": body[key]
        });
    }

    const createdTask = await updateTask(taskId, organizationId, patchRequests);

    return {jsonBody: createdTask.resource, status: 200};
};

