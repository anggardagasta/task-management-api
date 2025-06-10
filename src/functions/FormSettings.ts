import {app} from "@azure/functions";
import {GetFormSettings} from "./FormSettings/GetFormSettings";
import {InsertFormSetting} from "./FormSettings/InsertFormSetting";
import {UpdateFormSetting} from "./FormSettings/UpdateFormSetting";
import {DeleteFormSetting} from "./FormSettings/DeleteFormSetting";

app.http('GetFormSettings', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'FormSettings/Get',
    handler: GetFormSettings
});

app.http('InsertFormSetting', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'FormSettings/Insert',
    handler: InsertFormSetting
});

app.http('UpdateFormSetting', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'FormSettings/Update',
    handler: UpdateFormSetting
});

app.http('DeleteFormSetting', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'FormSettings/Delete',
    handler: DeleteFormSetting
});