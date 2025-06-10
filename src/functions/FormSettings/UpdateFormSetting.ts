import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {updateFormSetting} from "../../services/formSettingService";

export async function UpdateFormSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.query.get("id");
    if (!id) return {status: 400, body: "Missing id"};

    const body = await request.json() as any;
    if (!body.organizationId) {
        return {status: 400, body: "Missing organizationId"};
    }
    if (!body.name) {
        return {status: 400, body: "Missing name"};
    }

    try {
        const result = await updateFormSetting(id, body);
        return {jsonBody: result, status: 200};
    } catch (err: any) {
        context.error(`UpdateFormSetting error: ${err.message}`);
        return {status: 500, body: `Failed to update form setting: ${err.message}`};
    }
}


