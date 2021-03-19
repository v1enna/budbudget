import { API_REGISTER_URL } from "../config";
import { fetchApi } from "./_helpers";

/**
 * Try to authenticate the user.
 * If successfull return session id (sid).
 * If not return empty string.
 */
export async function Register(
	username: string,
	password: string,
	email:string
): Promise<boolean> {
	const reqBody = { username: username, password: password, email:email };

	const response = await fetchApi(API_REGISTER_URL, "POST", reqBody);

	if (!response.ok) return false;

	// { sid: string }
	const session = await response.json();

	return true;
}