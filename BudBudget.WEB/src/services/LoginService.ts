import { API_LOGIN_URL } from "../config";
import { fetchApi } from "./_helpers";

/**
 * Try to authenticate the user.
 * If successfull return session id (sid).
 * If not return empty string.
 */
export async function Authenticate(
	username: string,
	password: string,
	remember: boolean
): Promise<string> {
	const reqBody = { username: username, password: password };

	const response = await fetchApi(API_LOGIN_URL, "POST", reqBody);

	if (!response.ok) return "";

	// { sid: string }
	const session = await response.json();

	remember
		? localStorage.setItem("sid", session.sid)
		: sessionStorage.setItem("sid", session.sid);

	return session.sid;
}
