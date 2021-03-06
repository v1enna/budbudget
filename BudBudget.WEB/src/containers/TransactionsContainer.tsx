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
					placeholder="Categorie"
					// onChange={onChange}
					filterOption
				>
					{categories.map((c) => {
						return <Option value={c.name}>{c.name}</Option>;
					})}
				</Select>
				<Search
					placeholder="Cerca..."
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
					}}
				/>
			</Content>
		</Layout>
	);
}
