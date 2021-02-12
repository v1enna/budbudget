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

const { Header, Content } = Layout;

export interface MonthlyData {
	month: string,
	monthValue: number,
	type: string 
}

interface CategoryValues {
	categoryName: string,
	categoryValue: number
}

export default function DashboardContainer() {

	// Generate data filtered by category for both the table and the main graph
	
	function generateDataSource() : CategoryValues[] {
		// Somehow fetch entries by category here
		var data : CategoryValues[] = [];

		// If no entries found, fill with example data
		if(data.length === 0) {
			for(let i = 0; i < 10; i++) {
				data.push({
					categoryName: require('randomstring').generate({
						length: 10,
						charset: 'alphabetic',
						readable: (Math.random() === 1) ? true : false
					}),
					categoryValue: Math.floor(Math.random() * 149)
				});
			}
		}

		// sort data by value
		data.sort((x, y) => x.categoryValue - y.categoryValue);

		return data;
	};

	const dataSource = generateDataSource();

	return (
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
							<CategoryBarChart 
								dataSource={dataSource} 
							/>
						</Card>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Card title={"Spese per categoria"}>
							<Table 
								columns={[
									{
										title: 'Categoria',
										dataIndex: 'categoryName',
										key: 'categoryName'
									},
									{
										title: 'Valore',
										dataIndex: 'categoryValue',
										key: 'categoryValue'
									}	
								]} 
									
								dataSource={dataSource}
							/>
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
	)
}
