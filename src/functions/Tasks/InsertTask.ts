import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {v4 as uuidv4} from "uuid";
import {insertTask} from "../../services/taskService";
import {validateTask} from "../../utils/validation";
import {Task} from "../../models/Task";

export async function InsertTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = await request.json() as Task;
    const validationError = validateTask(body);
    if (validationError) {
        return {status: 400, body: validationError};
    }
    const taskToInsert: Task = {
        ...body,
        id: uuidv4()
    };
    const result = await insertTask(taskToInsert);
    return {jsonBody: result, status: 200};
}


