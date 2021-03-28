import { Line } from "@ant-design/charts";
import React from "react";
import { MonthlyValues } from "../containers/DashboardContainer";

export default function BalanceLinesChart(props: {
	dataSource: MonthlyValues[];
	monthNames: string[];
}) {
	/* 
		Format month name by its calendar index, eg. 1 -> 'January'
		Same result could also be obtained, perhaps more efficiently, by using ..
		.. date.toLocaleString() on a Date object
	*/
	const formattedMonthlyValues = props.dataSource.map((x) => {
		return {
			monthName: props.monthNames[x.month],
			...x,
		};
	});

	const config = {
		data: formattedMonthlyValues,
		xField: "monthName",
		yField: "monthValue",
		seriesField: "type",
		meta: {
			monthValue: {
				formatter: (val: string) => {
					return val + "€";
				},
			},
		},
		color: ["green", "red"],
	};

	/*
		Parse gains and losses, and re-evaluate them whenever the state is updated
	*/
	const monthlyGains = () => {
		let monthlyGains = 0;
		for (let x of props.dataSource)
			if (x.type === "Entrata") monthlyGains += x.monthValue;

		return monthlyGains;
	};

	const monthlyLosses = () => {
		let monthlyGains = 0;
		for (let x of props.dataSource)
			if (x.type === "Uscita") monthlyGains += x.monthValue;

		return monthlyGains;
	};

	const monthlyBalance = monthlyGains() - monthlyLosses();

	return (
		<div>
			<div className="balance">
				<div className="money">
					<strong>
						Balance: <span>+{monthlyBalance}€</span>
					</strong>
				</div>

				<div className="money_in">
					<strong>
						Gains: <span>+{monthlyGains()}€</span>
					</strong>
				</div>

				<div className="money_out">
					<strong>
						Losses: <span>-{monthlyLosses()}€</span>
					</strong>
				</div>
			</div>

			<Line {...config} />
		</div>
	);
}
