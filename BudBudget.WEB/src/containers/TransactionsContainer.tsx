import { Input, Layout, Select } from "antd";
import React, { useEffect, useState } from "react";
import TransactionsTable, { TableEntry } from "../components/TransactionsTable";
import { Category } from "../models/Category";
import { getCategories, getEntries } from "../services/DataService";
import "./TransactionsContainer.css";

const { Header, Content } = Layout;

const { Search } = Input;
const { Option } = Select;

export default function TransactionsContainer() {
	const [entries, setEntries] = useState<TableEntry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedEntries, setSelectedEntries] = useState<TableEntry[]>([]);
	const [selectedEntriesValue, setSelectedEntriesValue] = useState(0);
	const [nameFilter, setNameFilter] = useState("");
	const [categoriesFilter, setCategoriesFilter] = useState<Category[]>([]);

	useEffect(() => {
		async function fetchData() {
			const entries = await (await getEntries()).map((e) => {
				return { key: e.id, ...e };
			});
			setEntries(entries);
			const categories = await getCategories();
			setCategories(categories);
		}
		fetchData();
	}, []);

	const filteredEntries = entries.filter((e) =>
		e.description.includes(nameFilter)
	);

	return (
		<Layout>
			<Header className="header_transactions">
				<Select
					showSearch
					mode="multiple"
					style={{ width: 200 }}
					placeholder="Categories"
					// onChange={onChange}
					filterOption
				>
					{categories.map((c) => {
						return <Option value={c.name}>{c.name}</Option>;
					})}
				</Select>

				{ selectedEntries.length !== 0 ?
					/*
						Display a button with the overall value of the selected entries.
						If no entry is selected, leave it blank
					*/
					(
						<Button
							type="dashed"
							disabled
							className={"selected_entries_value " + (selectedEntriesValue > 0 ? "money_in" : "money_out")}
						>
							Selected entries value: {selectedEntriesValue}€
						</Button>
					) : (
						<div></div>
					)
				}

				<Search
					placeholder="Search..."
					allowClear
					onChange={(e) => setNameFilter(e.target.value)}
					className="search_name"
				/>
			</Header>
			<Content className="content_transactions">
				<TransactionsTable
					dataSource={filteredEntries}
					categories={categories}
					rowSelection={{
						type: "checkbox",
						onChange: (keys, rows) => {
							setSelectedEntries(rows);
						},
						/*
							onSelect is needed to determine if the user either selected or deselected an entry, ..
							.. which is impossibile with onChange
						*/
						onSelect: (record, selected) => {
							setSelectedEntriesValue(
								Math.round(
									selectedEntriesValue + (selected ? record.value : - record.value)
								)
							);
						}
					}}
				/>
			</Content>
		</Layout>
	);
}
