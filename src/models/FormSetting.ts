export interface FormSettingField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'dropdown' | 'date' | 'email';
    column: string;
    required: boolean;
    options?: string[];
    order: number;
}

export interface FormSetting {
    id: string;
    organizationId: string;
    name: string;
    fields: FormSettingField[];
}
