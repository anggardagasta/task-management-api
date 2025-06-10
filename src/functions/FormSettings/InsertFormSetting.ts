import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {v4 as uuidv4} from "uuid";
import {insertFormSetting} from "../../services/formSettingService";

export async function InsertFormSetting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = await request.json() as any;
    if (!body.organizationId) {
        return {status: 400, body: "Missing organizationId"};
    }
    if (!body.name) {
        return {status: 400, body: "Missing name"};
    }

    const id = uuidv4();
    const setting = {
        id,
        organizationId: body.organizationId,
        name: body.name,
        fields: body.fields
    };
    const result = await insertFormSetting(setting);

    return {jsonBody: result, status: 201};
}

