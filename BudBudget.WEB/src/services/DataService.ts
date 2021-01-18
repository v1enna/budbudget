import { API_FETCHALL_URL } from '../config';
import { Entry } from '../models/Entry';

export async function getEntries() : Promise<Array<Entry>> {
	try {
		const response = await fetch(API_FETCHALL_URL, {credentials: "include"});	
		return await response?.json();	
	}
	catch(e) {
		console.log(e);
		return [];
	}

}