import { Button, Card, Checkbox, Layout, Select } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { RangeValue } from "rc-picker/lib/interface";
import React, { useEffect, useState } from "react";
import CategoryExpensesList from "../components/CategoryExpensesList";
import DatePicker from "../components/DatePicker";
import Page from "../components/Report1Graph";
import { Category } from "../models/Category";
import { Entry } from "../models/Entry";
import { getCategories, getEntries } from "../services/DataService";
import "./ReportsContainer.css";

const { Header, Content } = Layout;

const CheckboxGroup = Checkbox.Group;

const { RangePicker } = DatePicker;

export default function ReportsContainer() {
	// Fetching entries and categories, also setting categories as checked
	const [entries, setEntries] = useState<Entry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	useEffect(() => {
		async function fetchCategories() {
			const categories = await getCategories();
			setCategories(categories);
			setCheckedList(categories.map((category: Category) => category.id));
			updateTotal(categories);
		}

		async function fetchEntries() {
			const entries = await getEntries();
			setEntries(entries);
		}

		fetchEntries();
		fetchCategories();
	}, []);

	//Stuff that is needed for the checkbox and datepicker to work
	const [indeterminate, setIndeterminate] = React.useState(false);
	const [checkAll, setCheckAll] = React.useState(true);
	const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>(
		[]
	);
	const [pickedDates, setPickedDates] = useState<RangeValue<Date>>(null);

	//Controls behaviour when something is checked in the checkbox list
	const onChange = (list: CheckboxValueType[]) => {
		setCheckedList(list);
		setIndeterminate(!!list.length && list.length < categories.length);
		setCheckAll(list.length === categories.length);
	};

	//Controls behaviour of the check-all button
	const onCheckAllChange = (e: CheckboxChangeEvent) => {
		setCheckedList(
			e.target.checked
				? categories.map((category: Category) => category.id)
				: []
		);
		setIndeterminate(false);
		setCheckAll(e.target.checked);
	};

	//Controls behaviour of the date-range picker
	function datePicked(dates: RangeValue<Date>) {
		setPickedDates(dates);
	}

	const [total, setTotal] = useState<number>(0);
	const [graphData, setGraphData] = useState<Entry[]>([]);

	//Setting a use effect to change the graph data when the checkbox/date picker changes
	useEffect(() => {
		setGraphData(extractGraphData(checkedList as string[], pickedDates));
	}, [checkedList, pickedDates]);

	//Extracts an Entry[] to be sent to the graph and the table
	function extractGraphData(
		selectedCats: string[],
		selectedDates: RangeValue<Date>
	): Entry[] {
		let result: Entry[] = entries;
		//Returns entries which have the checked category (if something is checked)
		if (selectedCats.length) {
			result = result.filter((entry) =>
				selectedCats.includes(entry.category?.id as string)
			);
			//If a date-range is selected and there are entries that passed the previous check
			//check if they are in the date range
			if (selectedDates && result.length) {
				result = result.filter(
					(entry) =>
						entry.datetime! > selectedDates[0]! &&
						entry.datetime! < selectedDates[1]!
				);
				updateTotal(result);

				return result;
			}
			updateTotal(result);
			return result;
		}
		updateTotal(result);
		return [];
	}

	//Updates the total state to be shown on top of the page to current entries total value
	function updateTotal(arrayOfEntries: Entry[]) {
		setTotal(
			arrayOfEntries.reduce((acc, entry: Entry) => acc + entry.value, 0)
		);
	}

	return (
		<Layout>
			<Header className="header_reports">
				<Select
					showSearch
					mode="multiple"
					style={{ width: 300 }}
					placeholder="Categories"
					filterOption={true}
					className="categories_picker"
					dropdownRender={() => (
						<div>
							<Checkbox
								indeterminate={indeterminate}
								onChange={onCheckAllChange}
								checked={checkAll}
								className="check_all"
							>
								Check all
							</Checkbox>
							<CheckboxGroup
								className="checkbox_group"
								options={categories.map(
									(category: Category) => {
										return {
											label: category.name,
											value: category.id,
										};
									}
								)}
								value={checkedList}
								onChange={onChange}
							/>
						</div>
					)}
				></Select>
				<RangePicker
					showNow
					format="yyyy-MM-dd"
					className="date_picker"
					onChange={datePicked}
				/>
				{total !== NaN ? (
					/*
							Display a button with the overall value of the selected entries.
							If no entry is selected, leave it blank
						*/
					<Button
						type="dashed"
						disabled
						className={
							"total_alert " +
							(total > 0 ? "money_in" : "money_out")
						}
					>
						{"Total: " + total}€
					</Button>
				) : (
					<div></div>
				)}
			</Header>
			<Content className="content_reports">
				<Card>
					<Page dataSource={graphData} />
				</Card>
			</Content>
			<Content className="content_reports">
				<Card>
					<CategoryExpensesList dataSource={graphData} />
				</Card>
			</Content>
		</Layout>
	);
}
