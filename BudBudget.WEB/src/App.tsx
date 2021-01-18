import React, { useState } from "react";
import "./App.css";
import LoginPage from "./containers/LoginPage";
import { LoginContext } from "./contexts/LoginContext";
import Routes from "./Routes";

function App() {
	const sid =
		document.cookie.indexOf("sid=") >= 0
			? document.cookie
					.split("; ")
					.map((x) => x.split("="))
					.filter((v) => v[0] === "sid")[0][1]
			: "";

	const [isLoggedIn, setIsLoggedIn] = useState(sid ? true : false);

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
