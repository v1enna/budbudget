import { parseISO } from "date-fns";
import {
	API_CATEGORIES_URL,
	API_ENTRIES_URL,
	API_FETCHALL_URL
} from "../config";
import { Entry } from "../models/Entry";
import { fetchApi } from "./_helpers";

export async function getEntries(): Promise<Array<Entry>> {
	try {
		const response = await fetchApi(API_FETCHALL_URL);
		const data = await response?.json();

		return data.map((d: any) => ({ ...d, datetime: parseISO(d.datetime) }));
	} catch (e) {
		console.log(e);
		return [];
	}
}

export async function getCategories() {
	try {
		const response = await fetchApi(API_CATEGORIES_URL);
		const data = await response?.json();

		return data;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export async function createEntry(entry: any) {
	try {
		const response = await fetchApi(API_ENTRIES_URL, "POST", entry);
		const data = await response?.json();

		return data;
	} catch (e) {
		console.log(e);
		return {};
	}
}
