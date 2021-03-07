import { Form, Input, Select, Table } from "antd";
import { TableProps } from "antd/lib/table";
import { ColumnType, SortOrder } from "antd/lib/table/interface";
import { compareAsc, format } from "date-fns";
import React, { PropsWithChildren, useState } from "react";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { createEntry } from "../services/DataService";
import DatePicker from "./DatePicker";

export interface TableEntry extends Entry {
	key: string;
}

interface TransactionsTableProps<RecordType> extends TableProps<RecordType> {
	categories: Category[];
}

interface EditableCellProps extends PropsWithChildren<any>, TableEntry {
	editing: boolean;
	dataIndex: string;
	dataType: string; // it's the enum, but must be string
	placeholder: string;
}

enum EntryDataType {
	DateTime,
	Category,
	Text,
	Money,
	None,
}

interface EditableColumn extends ColumnType<TableEntry> {
	dataType: EntryDataType;
}

const { Option } = Select;

export default function TransactionsTable(
	props: TransactionsTableProps<TableEntry>
) {
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

	const [creatingTransaction, setCreatingTransaction] = useState(false);
	const [dateNewEntry, setDateNewEntry] = useState<Date | null>(null);
	const [form] = Form.useForm();

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

	const EditableCell = ({
		children,
		editing,
		id,
		dataIndex,
		dataType,
		placeholder,
		...restProps
	}: EditableCellProps) => {
		function renderInput(dataType: string, placeholder?: string) {
			switch (dataType) {
				case EntryDataType.Text.toString():
					return <Input placeholder={placeholder} />;
				case EntryDataType.DateTime.toString():
					return (
						<DatePicker
							value={dateNewEntry}
							placeholder={placeholder}
							showNow
							format="yyyy-MM-dd"
							onChange={(d) => {
								setCreatingTransaction(true);
								d && setDateNewEntry(d);
							}}
						/>
					);
				case EntryDataType.Money.toString():
					return (
						<Input
							placeholder={placeholder}
							type="number"
							style={{ width: "100px" }}
							prefix="€"
						/>
					);
				case EntryDataType.Category.toString():
					return (
						<Select
							showSearch
							style={{ width: 200 }}
							placeholder={placeholder}
							// onChange={onChange}
							filterOption
							optionFilterProp="children"
						>
							{props.categories.map((c) => {
								return <Option value={c.id}>{c.name}</Option>;
							})}
						</Select>
					);
				default:
					break;
			}
		}

		if (editing) {
			return (
				<td {...restProps}>
					<Form.Item name={dataIndex} style={{ margin: 0 }}>
						{creatingTransaction
							? renderInput(dataType, placeholder)
							: dataType === EntryDataType.DateTime.toString()
							? renderInput(dataType, "Nuova transazione")
							: ""}
					</Form.Item>
				</td>
			);
		}
		return <td {...restProps}>{children}</td>;
	};

	const columns: EditableColumn[] = [
		{
			title: "Data",
			dataIndex: "datetime",
			dataType: EntryDataType.DateTime,
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
			dataType: EntryDataType.Text,
			key: "description",
			sortDirections: ["descend"],
		},
		{
			title: "Valore",
			dataIndex: "value",
			dataType: EntryDataType.Money,
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
			dataType: EntryDataType.Category,
			dataIndex: ["category", "name"],
		},
	];

	columns.forEach((c) => {
		c.onCell = (record) => {
			return {
				...record,
				dataIndex: c.dataIndex,
				editing: record.id === "",
				dataType: c.dataType.toString(), // string is needed
				placeholder: c.title?.toString(),
			};
		};
	});

	return (
		<Form
			form={form}
			preserve={false}
			onFinish={async (v) => {
				const entry = {
					id: v.id,
					datetime: dateNewEntry,
					name: v.description,
					description: v.description,
					value: v.value,
					categoryId: v.category.name,
					subCategoryId: v.category.name,
				};
				const e = await createEntry(entry);
				console.log(e);
				setCreatingTransaction(false);
			}}
			onKeyUp={(e) => {
				if (e.key === "Enter") form.submit();
			}}
		>
			<Table
				{...props}
				bordered
				dataSource={[emptyEntry, ...props.dataSource!]}
				pagination={false}
				columns={columns}
				components={{
					body: {
						cell: EditableCell,
					},
				}}
			/>
		</Form>
	);
}
