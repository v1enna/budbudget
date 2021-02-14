import { Line } from "@ant-design/charts";
import React from "react";
import { MonthlyData } from "../containers/DashboardContainer";

export default function BalanceLinesChart() {
	function generateDataSource(): MonthlyData[] {
		// Somehow fetch entries by category here (context?)
		var data: MonthlyData[] = [];

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
			"Dicembre",
		];

		// If no entries are found, fill with example data
		if (data.length === 0) {
			for (let j = 0; j < 2; j++) {
				for (let i = 0; i < 12; i++) {
					data.push({
						month: monthNames[i],
						monthValue: Math.floor(Math.random() * 1000),
						type: j ? "Entrata" : "Uscita",
					});
				}
			}
		}

		return data;
	}

	const dataSource = generateDataSource();

	const config = {
		data: dataSource,
		xField: "month",
		yField: "monthValue",
		seriesField: "type",
		color: ["red", "green"],
	};

	return <Line {...config} />;
}
