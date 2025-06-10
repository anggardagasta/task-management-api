import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getFormSettings} from "../../services/formSettingService";

export async function GetFormSettings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const organizationId = request.query.get("organizationId");
    if (!organizationId) return {status: 400, body: "Missing organizationId"};

    const settings = await getFormSettings(organizationId);
    if (!settings) return {status: 404, body: "Not found"};

    return {jsonBody: settings, status: 200};
}