import { Layout, Menu } from "antd";
// import "antd/dist/antd.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import LoginPage from "./containers/LoginPage";
import { LoginContext } from "./contexts/LoginContext";
import Routes from "./Routes";

const { Content, Sider } = Layout;

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
				<Layout hasSider>
					<Sider width={200}>
						<Menu mode="vertical" className="sider_menu">
							<Menu.Item key="1">
								<Link to="/">Dashboard</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/transactions">Transazioni</Link>
							</Menu.Item>
							<Menu.Item key="3">
								<Link to="/reports">Reports</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Content className="content">
							<Routes />
						</Content>
					</Layout>
				</Layout>
			</LoginContext.Provider>
		);
	}
}

export default App;
