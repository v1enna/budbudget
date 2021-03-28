export function checkLogStatus() {
	if (localStorage.getItem("sid")) {
		return localStorage.getItem("sid");
	} else {
		return sessionStorage.getItem("sid");
	}
}

function authHeaders() {
	if (checkLogStatus()) {
		return { Authorization: "Bearer " + checkLogStatus() };
	}
	return { Authorization: "" };

	// if (localStorage.getItem("sid")) {
	// 	return { Authorization: "Bearer " + localStorage.getItem("sid") };
	// } else if(sessionStorage.getItem("sid")){
	// 	return { Authorization: "Bearer " + sessionStorage.getItem("sid") };
	// } else
	// {
	// 	return { Authorization: "" };
	// }
}

/**
 * Execute a fetch.
 * If the user is authenticated it uses his token.
 * @param url
 * @param method
 * @param body Object to send in the request body
 */
export async function fetchApi(url: string, method = "GET", body?: any) {
	return await fetch(url, {
		headers: {
			...authHeaders(),
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
		method: method,
		body: JSON.stringify(body),
	});
}
