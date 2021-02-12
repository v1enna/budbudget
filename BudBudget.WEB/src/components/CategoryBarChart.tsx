import React, { useState } from "react";
import { Bar } from "@ant-design/charts";

export default function CategoryBarChart(props : any) {

	const config = {
		data: props.dataSource,
		xField: "categoryValue",
		yField: "categoryName",
		seriesField: 'categoryName'
	}

	return (
		<Bar {...config} />
	)
}
