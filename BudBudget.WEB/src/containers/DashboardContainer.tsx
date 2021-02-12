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
import { 
	Bar,
	Line
 } from "@ant-design/charts";

const { Header, Content } = Layout;

interface CategoryValues {
	categoryName: string,
	categoryValue: number
}

interface MonthlyData {
	month: string, // eg. december ...
	monthValue: number, // always a positive value
	type: string // either gains or losses
}

export default function DashboardContainer() {

	/*

		Top graph: "Category Chart"
		Bar chart filtered by value per category.

	*/

	function createChartDataSource() : CategoryValues[] {
		// somehow fetch entries by category here
		var data : CategoryValues[] = [];

		// if no entries found, fill with example data
		if(data.length == 0) {
			for(let i = 0; i < 10; i++) {
				data.push({
					categoryName: require('randomstring').generate({
						length: 10,
						charset: 'alphabetic',
						readable: (Math.random() == 1) ? true : false
					}),
					categoryValue: Math.floor(Math.random() * 149)
				});
			}
		}

		// sort data by value
		data.sort((x, y) => x.categoryValue - y.categoryValue);

		return data;
	};

	const chartDataSource = createChartDataSource();

	const categoryColumns = [
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
		data: chartDataSource,
		xField: "categoryValue",
		yField: "categoryName",
		seriesField: 'categoryName'
	}
	
	/* 
		Bottom-right graph : "Overview Graph"
		Line monthly-based chart on the user's balance.
	*/

	
	function createOverviewDataSource() : MonthlyData[] {
		// somehow fetch entries by category here
		var data : MonthlyData[] = [];

		const monthNames = [
			"Gennaio",
			"Febbraio",
			"Marzo",
			"Aprile",
			"Maggio",
			"Giugno",
			"Luglio",
			"Agosto",
			"Settembre",
			"Ottobre",
			"Novembre",
			"Dicembre"
		]

		// if no entries found, fill with example data
		if(data.length == 0) {
			for(let j = 0; j < 2; j++) {
				for(let i = 0; i < 12; i++) {
					data.push({
						month: monthNames[i],
						monthValue: Math.floor(Math.random() * 1000),
						type: j ? "Entrata" : "Uscita"
					});
				}
			}
		}	
		
		return data;
	}

	const overviewData = createOverviewDataSource();

	const overviewConfig = {
		data: overviewData,
		xField: "month",
		yField: "monthValue",
		seriesField: "type",
		color: ["green", "red"]
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
								<Table columns={categoryColumns} dataSource={chartDataSource}></Table>
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
								<Line {...overviewConfig} />
							</Card>
						</Col>
					</Row>
				</Content>
			</Layout>
		</div>
	)
}
