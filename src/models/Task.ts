export interface Task {
    id: string;
    organizationId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    status: string
    tags?: string[];
}