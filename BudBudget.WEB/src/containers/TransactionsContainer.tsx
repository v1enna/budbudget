import { Button, Input, Layout, Select, Table } from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { getCategories, getEntries } from "../services/DataService";
import "./TransactionsContainer.css";

const { Header, Content } = Layout;

interface TableEntry extends Entry {
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

	const columns = [
		{
			title: "Data",
			dataIndex: "datetime",
			key: "datetime",
			render: (text: string, r: Entry) =>
				format(r.datetime, "yyyy-MM-dd"),
		},
		{
			title: "Descrizione",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Valore",
			dataIndex: "value",
			key: "value",
		},
		{
			title: "Categoria",
			key: "category",
			render: (text: string, record: Entry) =>
				`${record.category.name} - ${record.subCategory.name}`,
		},
	];

	const filteredEntries = entries.filter((e) =>
		e.description.includes(nameFilter)
	);

	return (
		<Layout>
			<Header className="header_transactions">
				<Button>test</Button>
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
				<Table
					columns={columns}
					dataSource={filteredEntries}
					pagination={false}
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
