import "./LoginPage.css";
import React, { useState } from "react";
import { Space, Form, Row, Input, Menu, Col, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Authenticate } from "../services/LoginService";
import { Register } from "../services/RegisterService";
import { Store } from "antd/lib/form/interface";

interface LoginFormData {
	username: string;
	password: string;
	remember: boolean;
}

interface RegisterFormData {
	username: string;
	password: string;
	email: string;
}

interface LoginPageProps {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage(props: LoginPageProps) {
	const [currentTab, setCurrentTab] = useState("login");
	const [messaggeError, setMessaggeError] = useState("");

	async function tryLogin(values: Store) {
		const formData = values as LoginFormData;

		const sid = await Authenticate(
			formData.username,
			formData.password,
			formData.remember
		);

		if (sid !== "") {
			props.setIsLoggedIn(true);
		} else {
			setMessaggeError("Username o password errati!");
		}
	}

	async function tryRegister(values: Store) {
		const formData = values as RegisterFormData;

		const returnValue = await Register(
			formData.username,
			formData.password,
			formData.email
		);

		returnValue ? setCurrentTab("login") : setMessaggeError("Dati duplicati!");
	}

	const switchTab = (e: any) => {
		console.log(e.key);
		setCurrentTab(e.key);
	};

	return (
		<div
			className="login-container"
			style={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Col xs={22} sm={20} md={18} xl={12}>
				<Row
					justify="center"
					style={{
						border: "1px solid #d3d3d3",
						height: "100%",
						padding: "5em  0 ",
					}}
				>
					<Space direction="vertical" size="large" style={{ width: "80%" }}>
						<div className="vertical">
							<h1 className="logo">BudBudget</h1>
							<p>Less time planning, more time enjoying</p>
						</div>
						<Menu
							style={{
								display: "flex",
								justifyContent: "center",
								border: "none",
							}}
							mode="horizontal"
							onClick={switchTab}
							selectedKeys={[currentTab]}
						>
							<Menu.Item key="login">Login</Menu.Item>
							<Menu.Item key="register">Register</Menu.Item>
						</Menu>

						{currentTab === "login" ? (
							<Form className="login_form" size="large" onFinish={tryLogin}>
								<Form.Item
									name="username"
									rules={[
										{ required: true, message: "Please input your username!" },
									]}
								>
									<Input
										prefix={<UserOutlined className="site-form-item-icon" />}
										placeholder="Username"
									/>
								</Form.Item>
								<Form.Item
									name="password"
									rules={[
										{ required: true, message: "Please input your password!" },
									]}
								>
									<Input
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
									/>
								</Form.Item>
								<Form.Item>
									<Form.Item name="remember" valuePropName="checked">
										<Checkbox>Remember me</Checkbox>
									</Form.Item>

									<Button
										className="login_button"
										type="primary"
										htmlType="submit"
										block
									>
										Login
									</Button>

									<div className="message_error" style={{ color: "red" }}>
										{messaggeError}
									</div>
								</Form.Item>
							</Form>
						) : (
							<Form
								className="register_form"
								size="large"
								onFinish={tryRegister}
							>
								<Form.Item
									name="username"
									rules={[
										{ required: true, message: "Please input your username!" },
									]}
								>
									<Input
										prefix={<UserOutlined className="site-form-item-icon" />}
										placeholder="Username"
									/>
								</Form.Item>
								<Form.Item
									name="email"
									rules={[
										{ required: true, message: "Please input your email!" },
									]}
								>
									<Input
										prefix={<MailOutlined className="site-form-item-icon" />}
										placeholder="Email"
									/>
								</Form.Item>
								<Form.Item
									name="password"
									rules={[
										{ required: true, message: "Please input your password!" },
									]}
								>
									<Input
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
									/>
								</Form.Item>
								<Form.Item>
									<Button
										className="login_button"
										type="primary"
										htmlType="submit"
										block
									>
										Register
									</Button>

									<div className="message_error" style={{ color: "red" }}>
										{messaggeError}
									</div>
								</Form.Item>
							</Form>
						)}
					</Space>
				</Row>
			</Col>
		</div>
	);
}
