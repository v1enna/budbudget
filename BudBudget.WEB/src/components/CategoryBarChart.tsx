import React from "react";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { Bar } from "@ant-design/charts";

export default function CategoryBarChart() {
	const data = [
		// should be sorted
		{
			name: "Mezzi",
			value: 120
		},
		{
			name: "Palestra",
			value: 75
		},
		{
			name: "Vestiti",
			value: 100
		},
		{
			name: "Cibo",
			value: 95
		},
	];

	const config = {
		data: data,
		xField: "value",
		yField: "name",
		seriesField: 'name'
	}

	return (
		<div>
			<Bar {...config} />
		</div>
	)
}
