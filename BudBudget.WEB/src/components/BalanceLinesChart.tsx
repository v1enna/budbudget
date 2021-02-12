import React, { createContext } from 'react'
import { Line } from "@ant-design/charts";
import { DashboardContext } from "../contexts/DashboardContext";

export default function BalanceLinesChart() {
	const contextType = DashboardContext;

	interface MonthlyData {
		month: string, // eg. december ...
		monthValue: number, // always a positive value
		type: string // either gains or losses
	}
	
	function generateDataSource() : MonthlyData[] {
		// Somehow fetch entries by category here (context?)
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

		// If no entries are found, fill with example data
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

	const dataSource = generateDataSource();

	const config = {
		data: dataSource,
		xField: "month",
		yField: "monthValue",
		seriesField: "type",
		color: ["green", "red"]
	}

	return (
		<Line {...config} />
	)
}
