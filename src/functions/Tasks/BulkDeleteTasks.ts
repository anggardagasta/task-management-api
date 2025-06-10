import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {bulkDeleteTasks} from "../../services/taskService";

export async function BulkDeleteTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const body = await request.json() as string[];
    const organizationId = request.query.get('organizationId');

    if (!Array.isArray(body) || !organizationId) {
        return {status: 400, body: "Invalid request body or missing organizationId."};
    }

    await bulkDeleteTasks(body, organizationId);

    return {status: 200};
}
