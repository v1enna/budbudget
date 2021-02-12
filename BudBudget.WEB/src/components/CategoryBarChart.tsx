import React from "react";
import { Bar } from "@ant-design/charts";

export default function CategoryBarChart() {
	interface CategoryValues {
		categoryName: string,
		categoryValue: number
	}

	function generateDataSource() : CategoryValues[] {
		// Somehow fetch entries by category here
		var data : CategoryValues[] = [];

		// If no entries found, fill with example data
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

	const dataSource = generateDataSource();

	const config = {
		data: dataSource,
		xField: "categoryValue",
		yField: "categoryName",
		seriesField: 'categoryName'
	}

	return (
		<div>
			<Bar {...config} />
		</div>
	)
}
