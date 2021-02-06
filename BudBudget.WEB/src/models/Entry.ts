import { Category } from "./Category";

export interface Entry {
    "id": string,
    "datetime": Date|null,
    "name": string,
    "description": string,
    "value": number,
    "category": Category|null,
    "subCategory": Category|null,
    "updatedAt": Date|null,
    "deleted": boolean
}