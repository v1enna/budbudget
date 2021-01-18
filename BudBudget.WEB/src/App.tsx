import React, { useState } from "react";
import "./App.css";
import LoginPage from "./containers/LoginPage";
import { LoginContext } from "./contexts/LoginContext";
import Routes from "./Routes";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	if (!isLoggedIn) {
		return (
			<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
		);
	} else {
		return (
			<LoginContext.Provider value={{ isLoggedIn }}>
				<Routes />
			</LoginContext.Provider>
		);
	}
}

export default App;
