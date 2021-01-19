import { parseISO } from 'date-fns';
import { API_FETCHALL_URL } from '../config';
import { Entry } from '../models/Entry';

export async function getEntries() : Promise<Array<Entry>> {
	try {
		const response = await fetch(API_FETCHALL_URL, {credentials: "include"});	
		const data = await response?.json();
		
		return data.map((d: any) => ({...d, datetime: parseISO(d.datetime)}))
	}
	catch(e) {
		console.log(e);
		return [];
	}

}