import { Button, Input, Layout, Select } from "antd";
import React, { useEffect, useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import EntrySummary from "../components/EntrySummary";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { getCategories, getEntries, updateEntry } from "../services/DataService";
import "./TransactionsContainer.css";

const { Header, Content } = Layout;

export interface TableEntry extends Entry {
	key: string;
}

const { Search } = Input;
const { Option } = Select;

export default function TransactionsContainer() {
	const [entries, setEntries] = useState<TableEntry[]>([]);
	const [entryEditing, setEntryEditing] = useState<TableEntry>();
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
		e.description.toString().includes(nameFilter)
	).map((entry) => {
		return { 
			...entry, 
			edit: 
				<Button
					type="primary"
					onClick={() => setEntryEditing(entry)}
				>
					Edit
				</Button>
		}
	});

	return (
		<Layout>
			<Header className="header_transactions">
				<Select
					showSearch
					mode="multiple"
					style={{ width: 200 }}
					placeholder="Categorie"
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
				{ !entryEditing ? (
					<TransactionsTable
						dataSource={filteredEntries}
						rowSelection={{
							type: "checkbox",
							onChange: (keys, rows) => {
								setSelectedEntries(rows);
							}
						}}
					/>
					) : (
						<EntrySummary 
							entry={entryEditing}
							setEntryEditing={setEntryEditing}
						/>
					)
				}
			</Content>
		</Layout>
	);
}
