import { Column } from "@ant-design/charts";
import React from "react";
import { Entry } from "../models/Entry";

export interface graphData {
	categoryName: string;
	categoryValue: number;
	categoryId: string;
}

export default function Page(props: { dataSource: Entry[] }) {
	let _ = require("lodash");

	//Groups entries by category
	const groupedCategories = _.groupBy(
		props.dataSource,
		(entry: Entry) => entry.category?.name
	);

	/*Creates the dataSet of objects formatted like this {
		categoryName: **name**
		categoryValue: **sum of the values of the entries which belong to that entry**
	}*/
	const categoriesWithValues = _.map(
		groupedCategories,
		(entry: any, name: string) => {
			return {
				categoryName: name,
				categoryValue: _.reduce(
					entry,
					(acc: number, el: any) => acc + Math.abs(el.value),
					0
				),
			};
		}
	);

	var config = {
		data: categoriesWithValues,
		xField: "categoryName",
		yField: "categoryValue",
		seriesField: "CategoryValue",
		color: () => "#6394F9",
		meta: {
			categoryName: {
				alias: "Categoria",
			},
			categoryValue: {
				alias: "Spesa",
				max: 1000,
				min: 0,
				formatter: (val: string) => {
					return +val + "€";
				},
			},
		},
	};

	return <Column {...config} />;
}
