import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {deleteFormSetting} from "../../services/formSettingService";

export async function DeleteFormSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.query.get("id");
    if (!id) return {status: 400, body: "Missing id"};
    const organizationId = request.query.get("organizationId");
    if (!organizationId) return {status: 400, body: "Missing organizationId"};

    await deleteFormSetting(id, organizationId);

    return {status: 204};
}


