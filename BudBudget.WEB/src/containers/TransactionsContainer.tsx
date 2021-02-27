import { Button, Input, Layout, Select } from "antd";
import React, { useEffect, useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import LogoutButton from "../components/LogoutButton";
import { useLoginContext } from "../contexts/LoginContext";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { getCategories, getEntries } from "../services/DataService";
import "./TransactionsContainer.css";

const { Header, Content } = Layout;

export interface TableEntry extends Entry {
	key: string;
}

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
				<Button type="primary">Aggiungi transazione</Button>
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
				<LogoutButton />
			</Header>
			<Content className="content_transactions">
				<TransactionsTable
					dataSource={filteredEntries}
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
