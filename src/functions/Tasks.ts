import {app} from "@azure/functions";
import {InsertTask} from "./Tasks/InsertTask";
import {GetTasks} from "./Tasks/GetTasks";
import {UpdateTask} from "./Tasks/UpdateTask";
import {DeleteTask} from "./Tasks/DeleteTask";
import {BulkDeleteTasks} from "./Tasks/BulkDeleteTasks";
import {GetTask} from "./Tasks/GetTask";
import {GetTaskSummary} from "./Tasks/GetTaskSummary";

app.http('InsertTask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'Tasks/Insert',
    handler: InsertTask
});

app.http('GetTasks', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'Tasks/Get',
    handler: GetTasks
});

app.http('UpdateTask', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'Tasks/Update',
    handler: UpdateTask
});

app.http('DeleteTask', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'Tasks/Delete',
    handler: DeleteTask
});

app.http('BulkDeleteTasks', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'Tasks/BulkDelete',
    handler: BulkDeleteTasks
});

app.http('GetTask', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'Tasks/Find',
    handler: GetTask
});

app.http('GetTaskSummary', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'Tasks/Summary',
    handler: GetTaskSummary
});
