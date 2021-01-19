import { Layout, Table } from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useLoginContext } from "../contexts/LoginContext";
import { Entry } from "../models/Entry";
import { getEntries } from "../services/DataService";
import "./TransactionsContainer.css";

const { Header, Content } = Layout;

export default function TransactionsContainer() {
	const loginContext = useLoginContext();
	const [entries, setEntries] = useState<Array<Entry>>([]);

	useEffect(() => {
		async function fetchData() {
			const data = await getEntries();
			setEntries(data);
		}
		fetchData();
	}, []);

	const columns = [
		{
			title: "Data",
			dataIndex: "datetime",
			key: "id",
			render: (text: string, r: Entry) =>
				format(r.datetime, "yyyy-MM-dd"),
		},
		{
			title: "Descrizione",
			dataIndex: "description",
			key: "id",
		},
		{
			title: "Valore",
			dataIndex: "value",
			key: "id",
		},
		{
			title: "Categoria",
			key: "id",
			render: (text: string, record: Entry) =>
				`${record.category.name} - ${record.subCategory.name}`,
		},
	];

	return (
		<Layout>
			<Header className="header_transactions">Qui c'è il menù</Header>
			<Content className="content_transactions">
				<Table
					columns={columns}
					dataSource={entries}
					pagination={false}
				/>
			</Content>
		</Layout>
	);
}
