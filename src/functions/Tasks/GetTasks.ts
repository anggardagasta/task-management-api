import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getTasks} from "../../services/taskService";

export async function GetTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const organizationId = request.query.get('organizationId');
    if (!organizationId) {
        return {status: 400, body: "Missing organizationId query parameter."};
    }
    const body = await request.json() as any;
    let page = body.page ? String(body.page) : '1';
    let limit = body.limit ? String(body.limit) : '10';
    const search = body.search;

    try {
        const { tasks, total } = await getTasks(organizationId, page, limit, search);
        const currentPage = parseInt(page);
        const itemsPerPage = parseInt(limit);
        const totalPages = Math.ceil(total / itemsPerPage);
        return { jsonBody: { tasks, currentPage, itemsPerPage, totalItems: total, totalPages }, status: 200 };
    } catch (err) {
        context.log("Error querying tasks:", err);
        return {status: 500, body: "Failed to fetch tasks."};
    }
}


