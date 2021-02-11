import React from 'react'
import { 
	Card, 
	Col, 
	Row,
	Layout
} from 'antd'
import "./DashboardContainer.css"

const { Header, Content } = Layout;

export default function DashboardContainer() {
	return (
		<div>
			<Layout>
				<Header style={{ background: "#ffffff" }}>
					<div>
						Bentornato, <strong>Nome Cognome</strong>
					</div>
				</Header>
				<Content className="dashboard-container-content">
					<Row className="content-row">
						<Col span={24}>
							<Card title={"Dove ho speso di più?"}>
							&nbsp;
							</Card>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Card title={"Spese per categoria"}>
								&nbsp;
							</Card>
						</Col>
						<Col span={12}>
							<Card title={"Saldo complessivo"}>
								&nbsp;
							</Card>
						</Col>
					</Row>
				</Content>
			</Layout>
		</div>
	)
}
