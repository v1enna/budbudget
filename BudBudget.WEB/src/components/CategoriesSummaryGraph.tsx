import { Bar } from "@ant-design/charts";
import React from "react";
import { CategoryValues } from "../containers/DashboardContainer";

export default function CategoryBarChart(props: {
	dataSource: CategoryValues[];
}) {
	const config = {
		data: props.dataSource,
		xField: "categoryValue",
		yField: "categoryName",
		seriesField: "CategoryValue",
		color: () => "#6394F9",
		meta: {
			categoryName: {
				alias: "Categoria",
			},
			categoryValue: {
				alias: "Spesa",
				max: -1000,
				min: 0,
				formatter: (val: string) => {
					return "-" + val + "€";
				},
			},
		},
	};

	return <Bar {...config} />;
}
