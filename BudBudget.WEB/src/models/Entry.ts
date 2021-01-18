import { Category } from "./Category";

export interface Entry {
    "id": string,
    "datetime": Date,
    "name": string,
    "description": string,
    "value": number,
    "category": Category,
    "subCategory": Category,
    "updatedAt": Date,
    "deleted": boolean
}