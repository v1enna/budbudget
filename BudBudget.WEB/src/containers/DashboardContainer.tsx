import React, { useState } from 'react';
import { 
	Card, 
	Col, 
	Row,
	Layout,
	Table
} from 'antd';
import "./DashboardContainer.css";
import CategoryBarChart from "../components/CategoryBarChart";
import BalanceLinesChart from "../components/BalanceLinesChart";
import { DashboardContext } from "../contexts/DashboardContext";

const { Header, Content } = Layout;

export default function DashboardContainer() {
	
	const [dashboardContext, setDashboardContext] = useState({});

	return (
		<DashboardContext.Provider value={{ dashboardContext, setDashboardContext }}>
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
								<CategoryBarChart />
							</Card>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Card title={"Spese per categoria"}>
								<Table />
							</Card>							
						</Col>
						<Col span={12}>
							<Card title={"Andamento mensile"}>
								<div className="balance">
									<div className="money">
										<strong>Saldo attuale: <span>2917€</span></strong>
									</div>
									<div className="money_in">
										<strong>Entrate del mese: <span>+1203€</span></strong>
									</div>
									<div className="money_out">
										<strong>Uscite del mese: <span>-712€</span></strong>
									</div>
								</div>
								<BalanceLinesChart />
							</Card>
						</Col>
					</Row>
				</Content>
			</Layout>
		</DashboardContext.Provider>
	)
}
