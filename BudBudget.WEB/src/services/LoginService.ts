import { API_LOGIN_URL } from "../config";

/**
 * Try to authenticate the user.
 * If successfull return session id (sid).
 * If not return empty string.
 */
export async function Authenticate(
	username: string,
	password: string
): Promise<string> {
	const reqBody = { username: username, password: password };

	const response = await fetch(API_LOGIN_URL, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(reqBody),
	});

	if (!response.ok) return "";

	// { sid: string }
	const session = await response.json();

	return session.sid;
}
