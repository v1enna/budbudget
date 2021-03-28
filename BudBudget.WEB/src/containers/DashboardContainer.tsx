import { Card, Col, Layout, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import CategoriesSummaryGraph from "../components/CategoriesSummaryGraph";
import MonthlySummary from "../components/MonthlySummary";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { getCategories, getEntries } from "../services/DataService";
import "./DashboardContainer.css";

const { Content } = Layout;

export interface MonthlyValues {
	month: number;
	monthValue: number;
	type: string;
}

export interface CategoryValues {
	categoryName: string;
	categoryValue: number;
}

export default function DashboardContainer() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	/*
		Save English month names in order to parse the getMonth() value of Date objects
		.. in Entry records
	*/
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	useEffect(() => {
		/*
			Fetch entries and categories, and update component's state
		*/
		async function fetchEntries() {
			const entries = await getEntries();
			setEntries(entries);
		}

		async function fetchCategories() {
			const categories = await getCategories();
			setCategories(categories);
		}

		fetchEntries();
		fetchCategories();
	}, []);

	function fetchMonthlyValues() {
		const monthlyValues = () => {
			/*
				Fill a temporary array with every entry as MonthlyValues records
			*/
			const unfilteredMonthlyValues: MonthlyValues[] = entries.map(
				(x) => {
					return {
						/* 
							Entry.datetime could be null, so we must ensure that entries 
							without a correct date are not added into the array 
						*/
						month:
							x.datetime?.getMonth() !== undefined
								? x.datetime.getMonth()
								: 0, // All records with { month: 0 } will be later removed
						monthValue: Number(x.value),
						type: Number(x.value) >= 0 ? "Entrata" : "Uscita",
					};
				}
			);

			/* 
				Group records by month, then by gains and losses ..
				.. and sum both gains and losses distinctly
			*/
			const filteredMonthlyValues: () => MonthlyValues[] = () => {
				let temp = [];

				for (let j = 0; j < 2; j++) {
					for (let i = 0; i < 12; i++) {
						const monthValue = unfilteredMonthlyValues.reduce(
							/*
								Differentiate between gains and losses
							*/
							(sum, x) => {
								if (
									x.month === i + 1 &&
									j === 0 &&
									x.monthValue >= 0
								)
									sum += x.monthValue;
								else if (
									x.month === i + 1 &&
									j === 1 &&
									x.monthValue < 0
								)
									sum += x.monthValue;
								return sum;
							},
							0
						);

						temp[temp.length] = {
							month: i + 1,
							monthValue: Math.abs(Math.round(monthValue)),
							type: monthValue >= 0 ? "Entrata" : "Uscita",
						};
					}
				}

				// Delete records with no (or null) entries
				return temp.filter((x) => x.monthValue !== 0);
			};

			return filteredMonthlyValues();
		};

		return monthlyValues();
	}

	function fetchCategoryValues() {
		const categoryValues = () => {
			/*
				Parse every entry as a CategoryValue record
			*/
			const unfilteredCategoryValues: CategoryValues[] = entries.map(
				(x) => {
					return {
						categoryName:
							x.category !== null
								? x.category.name
								: "Non specificato",
						categoryValue: x.value,
					} as CategoryValues;
				}
			);

			/*
				Calculate the sum of transactions value grouped by category name ..
				.. then fill and return an array with the correct data
			*/
			const filteredCategoryValues: () => CategoryValues[] = () => {
				let temp = [];

				for (let y of categories) {
					const categoryValue = unfilteredCategoryValues.reduce(
						(sum, x) => {
							x.categoryName === y.name
								? (sum += x.categoryValue)
								: (sum += 0);
							return sum;
						},
						0
					);

					temp[temp.length] = {
						categoryName: y.name,
						categoryValue: Math.round(categoryValue),
					};
				}

				/*
					x.categoryValue === 0 is to be considered a junk entry
				*/
				return temp
					.filter((x) => x.categoryValue !== 0)
					.sort((x, y) => x.categoryValue - y.categoryValue);
			};

			return filteredCategoryValues();
		};

		return categoryValues();
	}

	/*
		Update graphs data when DashboardContainer's state is firstly set via useEffect()
		.. Otherwise, the child components will show either no entries or a blank area
	*/
	const monthlyValues = fetchMonthlyValues();
	const categoryValues = fetchCategoryValues();

	/*
		Fetch only lossers grouped by category
	*/
	const categoryLosses = fetchCategoryValues()
		.filter((x) => x.categoryValue < 0)
		.map((x) => {
			return {
				categoryValue: Math.abs(x.categoryValue),
				categoryName: x.categoryName,
			};
		});

	return (
		<Layout>
			<Content className="dashboard-container-content">
				<Row className="content-row">
					<Col span={24}>
						<Card title={"Expenses by category"}>
							{categoryValues ? (
								<CategoriesSummaryGraph
									dataSource={categoryLosses}
								/>
							) : (
								<div></div>
							)}
						</Card>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Card title={"All transactions by category"}>
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
										sorter: (x, y) =>
											x.categoryValue - y.categoryValue,
										defaultSortOrder: "ascend",
										render: (text) =>
											parseInt(text) > 0 ? (
												<span
													style={{ color: "green" }}
												>
													+{text}€
												</span>
											) : (
												<span style={{ color: "red" }}>
													{text}€
												</span>
											),
									},
								]}
								dataSource={categoryValues}
								rowKey="categoryName"
							/>
						</Card>
					</Col>
					<Col span={12}>
						<Card title={"Monthly summary"}>
							<MonthlySummary
								dataSource={monthlyValues}
								monthNames={monthNames}
							/>
						</Card>
					</Col>
				</Row>
			</Content>
		</Layout>
	);
}
