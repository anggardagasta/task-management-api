import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {deleteTask} from "../../services/taskService";

export async function DeleteTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const taskId = request.query.get('id');
    if (!taskId) {
        return {status: 400, body: "Missing id query parameter."};
    }

    const organizationId = request.query.get('organizationId');
    if (!organizationId) {
        return {status: 400, body: "Missing organizationId query parameter."};
    }

    await deleteTask(taskId, organizationId);

    return {status: 200};
}
