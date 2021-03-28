import { LoadingOutlined } from "@ant-design/icons";
import { Row, Spin } from "antd";
import "./LoadingAnimation.css";

const LoadingIcon = <LoadingOutlined spin style={{ fontSize: 45 }} />;

export default function LoadingAnimation() {
	return (
		<Row justify="center" align="middle" className="fullscreen">
			<Spin indicator={LoadingIcon} />
		</Row>
	);
}
