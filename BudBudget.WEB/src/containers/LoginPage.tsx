import { Button, Form, Input } from "antd";
import "antd/dist/antd.css";
import { Store } from "antd/lib/form/interface";
import React, { useState } from "react";
import { Authenticate } from "../services/LoginService";
import "./LoginPage.css";

interface LoginFormData {
	username: string;
	password: string;
}

interface LoginPageProps {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage(props: LoginPageProps) {
	const [messaggeError, setMessaggeError] = useState("");

	async function tryLogin(values: Store) {
		const formData = values as LoginFormData;

		const sid = await Authenticate(formData.username, formData.password);

		if (sid != "") {
			props.setIsLoggedIn(true);
		} else {
			setMessaggeError("Username o password errati!");
		}
	}

	return (
		<div className="login_container">
			<Form className="login_form" onFinish={tryLogin}>
				<Form.Item label="Username" name="username">
					<Input />
				</Form.Item>
				<Form.Item label="Password" name="password">
					<Input.Password />
				</Form.Item>
				<Form.Item>
					<Button
						className="login_button"
						type="primary"
						htmlType="submit"
					>
						Log in!
					</Button>

					<div className="message_error">{messaggeError}</div>
				</Form.Item>
			</Form>
		</div>
	);
}
