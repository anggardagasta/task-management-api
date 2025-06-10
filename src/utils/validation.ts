export function validateTask(task: any): string | null {
    if (!task) return "Task body is required.";

    if (!task.organizationId) return "Task organizationId is required.";

    return null;
}
