import React, { useState } from "react";
import "./App.css";
import LoginPage from "./containers/LoginPage";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	if (isLoggedIn) {
		return <>Loggato!!</>;
	} else {
		return <LoginPage setIsLoggedIn={setIsLoggedIn} />;
	}
}

export default App;
