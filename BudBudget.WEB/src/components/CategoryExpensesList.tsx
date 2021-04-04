import { Table } from "antd";
import { format } from "date-fns";
import React from "react";
import { Entry } from "../models/Entry";

enum EntryDataType {
	DateTime,
	Category,
	Text,
	Money,
	None,
}

export default function CategoryExpensesList(props: { dataSource: Entry[] }) {
	const data = props.dataSource;

	const columns = [
		{
			title: "Descrizione",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Valore",
			dataIndex: "value",
			key: "value",
			render: (text: string) =>
				parseInt(text) > 0 ? (
					<span style={{ color: "green" }}>+{text}€</span>
				) : (
					<span style={{ color: "red" }}>{text}€</span>
				),
		},
		{
			title: "Date",
			dataIndex: "datetime",
			dataType: EntryDataType.DateTime,
			key: "datetime",
			render: (text: string, r: Entry) =>
				r.id ? format(r.datetime!, "yyyy-MM-dd") : "Empty Slot",
		},
		{
			title: "Category",
			key: "category",
			dataType: EntryDataType.Category,
			dataIndex: ["category", "name"],
		},
	];

	return <Table columns={columns} dataSource={data} />;
}
