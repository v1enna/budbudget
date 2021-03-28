import {
	AreaChartOutlined,
	HomeOutlined,
	SolutionOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import LoginPage from "./containers/LoginPage";
import { LoginContext } from "./contexts/LoginContext";
import Routes from "./Routes";

const { Content, Sider } = Layout;

const { SubMenu } = Menu;

function App() {
	const sid = localStorage.getItem("sid");

	const [isLoggedIn, setIsLoggedIn] = useState(sid ? true : false);

	if (!isLoggedIn) {
		return (
			<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
		);
	} else {
		return (
			<LoginContext.Provider
				value={{
					isLoggedIn: isLoggedIn,
					setIsLoggedIn: setIsLoggedIn,
				}}
			>
				<Layout hasSider>
					<Sider width={200}>
						<Menu
							mode="inline"
							className="sider_menu"
							defaultSelectedKeys={["1"]}
						>
							<Menu.Item key="1">
								<Link to="/">
									<HomeOutlined />
									Dashboard
								</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/transactions">
									<SolutionOutlined />
									Transazioni
								</Link>
							</Menu.Item>
							<SubMenu
								key="sub1"
								title="Reports"
								icon={<AreaChartOutlined />}
							>
								<Menu.Item key="3">
									<Link to="/reports">Report 1</Link>
								</Menu.Item>
							</SubMenu>
							<SubMenu
								key="sub2"
								title="User"
								icon={<UserOutlined />}
							>
								<Menu.Item key="4">
									<Link to="/settings">Settings</Link>
								</Menu.Item>
								<Menu.Item
									key="5"
									danger
									onClick={() => {
										/*
													Simply removing the 'sid' item in the local storage won't update the App container ..
													.. nor would it refresh the page, thus logging out the user but not actually showing him ..
													.. the login page, as intended.
												*/
										setIsLoggedIn(false);
										localStorage.removeItem("sid");
									}}
								>
									Logout
								</Menu.Item>
							</SubMenu>
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
