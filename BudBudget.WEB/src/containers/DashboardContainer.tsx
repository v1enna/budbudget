import { Card, Col, Layout, Row, Table } from "antd";
import React from "react";
import BalanceLinesChart from "../components/BalanceLinesChart";
import CategoryBarChart from "../components/CategoryBarChart";
import "./DashboardContainer.css";

const { Header, Content } = Layout;

export interface MonthlyData {
	month: string;
	monthValue: number;
	type: string;
}

interface CategoryValues {
	categoryName: string;
	categoryValue: number;
}

/*

	To-fetch data

	Servono due dataset per la dashboard:
		- Per ogni mese per cui sono disponibili entry, fornire la somma dei valori delle entry raggruppate per categoria
			-> Rappresentabili con l'interfaccia CategoryValues
			-> Creare un array di CategoryValues e passarlo come {dataSource} a CategoryBarChart
			-> N.B - I valori vengono ordinati automaticamente in CategoryBarChart
		- Per ogni mese di cui sono disponibili entry, filtrare entrate e uscite (entrata => entryValue > 0)
			-> Rappresentabili con l'interfaccia MonthlyData
			-> eg. 
				{
					month: Gennaio
					monthValue: 500 (unsigned)
					type: true -> gains; false -> losses
				}

*/

export default function DashboardContainer() {
	// Generate data filtered by category for both the table and the main graph

	function generateDataSource(): CategoryValues[] {
		// Riempire {data} con un array di CategoryValues
		var data: CategoryValues[] = [];

		// Se non è possibile associare entry, genera casualmente dei dati (utile per testare il layout)
		if (data.length === 0) {
			for (let i = 0; i < 10; i++) {
				data.push({
					categoryName: require("randomstring").generate({
						length: 10,
						charset: "alphabetic",
						readable: Math.random() === 1 ? true : false,
					}),
					categoryValue: Math.floor(Math.random() * 149),
				});
			}
		}

		// Ordina i dati in funzione del valore
		data.sort((x, y) => x.categoryValue - y.categoryValue);

		return data;
	}

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
							<CategoryBarChart dataSource={dataSource} />
						</Card>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Card title={"Spese per categoria"}>
							<Table
								columns={[
									{
										title: "Categoria",
										dataIndex: "categoryName",
										key: "categoryName",
									},
									{
										title: "Valore",
										dataIndex: "categoryValue",
										key: "categoryValue",
									},
								]}
								dataSource={dataSource}
							/>
						</Card>
					</Col>
					<Col span={12}>
						<Card title={"Andamento mensile"}>
							<div className="balance">
								<div className="money">
									<strong>
										Saldo attuale: <span>2917€</span>
									</strong>
								</div>
								<div className="money_in">
									<strong>
										Entrate del mese: <span>+1203€</span>
									</strong>
								</div>
								<div className="money_out">
									<strong>
										Uscite del mese: <span>-712€</span>
									</strong>
								</div>
							</div>
							<BalanceLinesChart />
						</Card>
					</Col>
				</Row>
			</Content>
		</Layout>
	);
}
