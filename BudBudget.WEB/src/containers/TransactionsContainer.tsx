import { Button, Col, Form, Input, Layout, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import EntrySummary from "../components/EntrySummary";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import {
	getCategories,
	getEntries,
	updateEntry,
} from "../services/DataService";
import "./TransactionsContainer.css";
import { EditOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

export interface TableEntry extends Entry {
	key: string;
}

const { Search } = Input;
const { Option } = Select;

export default function TransactionsContainer() {
	const [entries, setEntries] = useState<TableEntry[]>([]);
	const [originalEntries, setOriginalEntries] = useState<TableEntry[]>([]);
	const [entryEditing, setEntryEditing] = useState<TableEntry>();
	const [categories, setCategories] = useState<Category[]>([]);
	const [editingEntry, setEditingEntry] = useState<boolean>(false);
	const [selectedEntries, setSelectedEntries] = useState<TableEntry[]>([]);
	const [nameFilter, setNameFilter] = useState("");
	const [categoriesFilter, setCategoriesFilter] = useState<Category[]>([]);

	useEffect(() => {
		async function fetchData() {
			const entries = await (await getEntries()).map((e) => {
				return { key: e.id, ...e };
			});
			setEntries(entries);
			setOriginalEntries(entries);
			const categories = await getCategories();
			setCategories(categories);
		}
		fetchData();
	}, []);

	async function editEntry(values: any, entry: TableEntry) {
		console.log(values);

		const request = await updateEntry({
			...entry,
			...values,
		});

		console.log(request?.status);
	}

	function editRow(entry: TableEntry) {
		if (!editingEntry) {
			setEditingEntry(true);

			const row = {
				...entry,
				description: (
					<Form
						name="descriptionForm"
						initialValues={{
							description: entry.description,
						}}
						onFinish={(values) => editEntry(values, entry)}
					>
						<Row gutter={12}>
							<Col span={12}>
								<Form.Item name="description">
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item>
									<Button htmlType="submit" type="primary">
										Submit
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				),
				value: (
					<Form
						name="valueForm"
						initialValues={{
							value: entry.value,
						}}
						onFinish={(values) => editEntry(values, entry)}
					>
						<Row gutter={12}>
							<Col span={12}>
								<Form.Item name="value">
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item>
									<Button htmlType="submit" type="primary">
										Submit
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				),
			};

			let filteredEntries = entries.filter((x) => x !== entry);

			filteredEntries[entries.indexOf(entry)] = row;

			setEntries([...filteredEntries]);
		} else restoreFetchedEntries();
	}

	function restoreFetchedEntries() {
		setEntries(originalEntries);
		setEditingEntry(false);
	}

	const filteredEntries = entries
		.filter((e) => e.description.toString().includes(nameFilter))
		.map((entry) => {
			return {
				...entry,
				edit: (
					<EditOutlined
						style={{ fontSize: 25 }}
						onClick={() => editRow(entry)}
					>
						Edit
					</EditOutlined>
				),
			};
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
