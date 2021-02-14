import { Bar } from "@ant-design/charts";
import React from "react";

export default function CategoryBarChart(props: any) {
	const config = {
		data: props.dataSource,
		xField: "categoryValue",
		yField: "categoryName",
		seriesField: "categoryName",
	};

	return <Bar {...config} />;
}
