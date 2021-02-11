import React from 'react';
import { 
	Card, 
	Col, 
	Row,
	Layout,
	Table
} from 'antd';
import "./DashboardContainer.css";
import CategoryBarChart from "../components/CategoryBarChart";
import { Bar } from "@ant-design/charts";

const { Header, Content } = Layout;

interface CategoryValues {
	categoryName: string,
	categoryValue: number
}

export default function DashboardContainer() {
	function createDataSource() : CategoryValues[] {
		// somehow fetch entries by category here
		var data : CategoryValues[] = [];

		// if no entries found, fill with example data
		if(data.length == 0) {
			for(let i = 0; i < 10; i++) {
				data.push({
					categoryName: require('randomstring').generate({
						length: 10,
						charset: 'alphabetic',
						readable: true
					}),
					categoryValue: Math.floor(Math.random() * 149)
				});
			}
		}

		return data;
	};

	const dataSource = createDataSource();

	const columns = [
		{
			title: "Categoria",
			dataIndex: "categoryName",
			key: "categoryName"
		},
		{
			title: "Valore",
			dataIndex: "categoryValue",
			key: "categoryValue"
		}
	];

	const chartConfig = {
		data: dataSource,
		xField: "categoryValue",
		yField: "categoryName",
		seriesField: 'categoryName'
	}

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
								<Bar {...chartConfig} />
							</Card>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Card title={"Spese per categoria"}>
								<Table columns={columns} dataSource={dataSource}></Table>
							</Card>
						</Col>
						<Col span={12}>
							<Card title={"Saldo complessivo"}>
								<div className="balance">
									<div className="money">
										<strong>Bilancio: <span>2917€</span></strong>
									</div>
									<div className="money_in">
										<strong>Entrate del mese: <span>+1203€</span></strong>
									</div>
									<div className="money_out">
										<strong>Uscite del mese: <span>-712€</span></strong>
									</div>
								</div>
							</Card>
						</Col>
					</Row>
				</Content>
			</Layout>
		</div>
	)
}
