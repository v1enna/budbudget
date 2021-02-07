import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/lib/table";
import { SortOrder } from "antd/lib/table/interface";
import { compareAsc, format } from "date-fns";
import React from "react";
import { TableEntry } from "../containers/TransactionsContainer";
import { Entry } from "../models/Entry";

interface TransactionsTableProps<RecordType> extends TableProps<RecordType> {}

export default function TransactionsTable(
	props: TransactionsTableProps<TableEntry>
) {
	// const [entries, setEntries] = useState(props.dataSource);

	// Empty entry for creating a new one.
	// If id is "" it is a empty entry
	const emptyEntry = {
		key: "",
		id: "",
		datetime: null,
		name: "",
		description: "",
		value: 0,
		category: null,
		subCategory: null,
		updatedAt: null,
		deleted: false,
	};

	function sortEmptyAtTop(
		a: Entry,
		b: Entry,
		sortOrder?: SortOrder,
		sorter?: (a: Entry, b: Entry) => number
	) {
		if (a.id === "") {
			return sortOrder === "ascend" ? 1 : -1;
		} else if (b.id === "") {
			return sortOrder === "descend" ? -1 : 1;
		} else {
			return sorter!(a, b);
		}
	}

	const columns: ColumnsType<TableEntry> = [
		{
			title: "Data",
			dataIndex: "datetime",
			key: "datetime",
			render: (text: string, r: Entry) =>
				r.id ? format(r.datetime!, "yyyy-MM-dd") : "CELLA VUOTA",
			sorter: (a: Entry, b: Entry, sortOrder?: SortOrder) => {
				return sortEmptyAtTop(a, b, sortOrder, (a, b) => {
					return compareAsc(a.datetime!, b.datetime!);
				});
			},
			sortDirections: ["descend", "ascend", "descend"],
		},
		{
			title: "Descrizione",
			dataIndex: "description",
			key: "description",
			sortDirections: ["descend"],
		},
		{
			title: "Valore",
			dataIndex: "value",
			key: "value",
			sorter: (a: Entry, b: Entry, sortOrder?: SortOrder) => {
				return sortEmptyAtTop(a, b, sortOrder, (a, b) => {
					return a.value - b.value;
				});
			},
			sortDirections: ["descend", "ascend", "descend"],
		},
		{
			title: "Categoria",
			key: "category",
			render: (text: string, record: Entry) =>
				`${record.category?.name} - ${record.subCategory?.name}`,
		},
	];

	return (
		<Table
			{...props}
			dataSource={[emptyEntry, ...props.dataSource!]}
			pagination={false}
			columns={columns}
			// sortDirections={["ascend", "descend"]}
		/>
	);
}

/**
 * if (a == XX) return 1;
 * if (b == XX) return -1;
 * else return a - b;
 */
