import { Button, Form, Input } from "antd";
import "antd/dist/antd.css";
import { Store } from "antd/lib/form/interface";
import React from "react";
import { Authenticate } from "../services/LoginService";
import "./LoginPage.css";

interface LoginFormData {
	username: string;
	password: string;
}

export default function LoginPage() {
	async function tryLogin(values: Store) {
		const formData = values as LoginFormData;

		const sid = await Authenticate(formData.username, formData.password);

		if (sid != "") window.alert(sid);
		else window.alert("password errata");
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
				</Form.Item>
			</Form>
		</div>
	);
}
