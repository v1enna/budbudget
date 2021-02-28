import { Category } from "./Category";

export interface Entry {
	"id": string,
	"datetime": Date | null,
	"name": string,
	"description": string | JSX.Element,
	"value": number | JSX.Element,
	"category": Category | null,
	"subCategory": Category | null,
	"updatedAt": Date | null,
	"deleted": boolean
}