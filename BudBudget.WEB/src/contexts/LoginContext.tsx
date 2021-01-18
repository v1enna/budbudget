import { createContext, useContext } from "react";

export interface LoginData {
	isLoggedIn: boolean;
}

export interface LoginDataContext {
	// loginData?: LoginData;
	// setLoginData?: React.Dispatch<React.SetStateAction<LoginData>>;
	isLoggedIn?: boolean;
	setIsLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginContext = createContext<LoginDataContext>({});

export function useLoginContext(): LoginDataContext {
	return useContext(LoginContext);
}
