import { createContext, useContext } from "react";

export interface LoginDataContext {
	isLoggedIn?: boolean;
	setIsLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginContext = createContext<LoginDataContext>({});

export function useLoginContext(): LoginDataContext {
	return useContext(LoginContext);
}
