import type { z } from "zod";

export interface FormFieldIssues {
    [key: string]: string[] | undefined;
    [key: number]: string[] | undefined;
    [key: symbol]: string[] | undefined;
}

interface FormDataObject {
    [key: string]: FormDataEntryValue | FormDataObject;
}

export function validateFormData<T extends z.ZodRawShape>(formData: FormData, schema: z.ZodObject<T>) {
    const object = convertFormDataToObject(formData)
    return schema.parse(object)
}

export function convertFormDataToObject(formData: FormData) {
    return formData.entries().reduce((acc: FormDataObject, [key, value]) => {
        const parts = key.split('.')

        parts.reduce((acc: FormDataObject, part, index) => {
            if (index === parts.length - 1) {
                acc[part] = value
                return acc
            }

            if (!acc[part]) {
                acc[part] = {}
            }

            return acc[part] as FormDataObject
        }, acc)

        return acc
    }, {})
}