function authHeaders() {
	const sid = localStorage.getItem("sid");

	if (sid) {
		return { Authorization: "Bearer " + sid };
	} else {
		return { Authorization: "" };
	}
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
