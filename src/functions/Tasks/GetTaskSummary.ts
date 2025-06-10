import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getTaskStatusSummary} from "../../services/taskService";

export async function GetTaskSummary(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const organizationId = request.query.get('organizationId');
    if (!organizationId) {
        return {status: 400, body: "Missing organizationId query parameter."};
    }

    let body: any = {};
    try {
        body = await request.json();
    } catch (e) {
        // ignore, allow empty body
    }
    const search = body.search || {};

    // Get all statuses and filtered tasks
    const {statuses, tasks} = await getTaskStatusSummary(organizationId, search);

    // Build summary with all statuses always present
    const summary: Record<string, number> = {};
    for (const status of statuses) {
        summary[status] = 0;
    }
    let total = 0;
    for (const t of tasks) {
        if (!t.status) continue;
        total++;
        const status = String(t.status).toLowerCase().replace(/\s|_/g, "_");
        if (status in summary) summary[status]++;
    }

    return {
        jsonBody: {
            total,
            ...summary
        },
        status: 200
    };
}
