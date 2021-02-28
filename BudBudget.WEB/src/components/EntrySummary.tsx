import { Button, Card, Form, Input } from 'antd'
import React, { useState } from 'react'
import { TableEntry } from '../containers/TransactionsContainer'
import { updateEntry } from '../services/DataService';

export default function EntrySummary(props: {
	entry: TableEntry,
	setEntryEditing: React.Dispatch<React.SetStateAction<TableEntry | undefined>>
}) {
	const [status, setStatus] = useState<JSX.Element>(<span>Pending...</span>);

	async function editEntry(values: any) {
		const request = await updateEntry({
			...props.entry,
			description: values.description,
			value: values.value
		});

		request?.status === 200 ?
			setStatus(<span className="success">Success!</span>)
		:
			setStatus(<span className="failure">Failure!</span>)
	}

	return (
		<Card 
			extra={
				<Button 
					danger
					type="primary"
					onClick={
						() => props.setEntryEditing(undefined)}
				>
					Close
				</Button>
			}
			title={"Edit Entry (" + props.entry.id.toUpperCase() + ")"}
		>
			<Form
				name="editing"
				onFinish={(values) => editEntry(values)}
				initialValues={{
					description: props.entry.description,
					value: props.entry.value,
				}}
			>
				<Form.Item
					label="Description"
					name="description"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Value"
					name="value"
				>
					<Input />
				</Form.Item>

				<Form.Item>
					<Button
						htmlType="submit"
						type="primary"
					>
						Submit
					</Button>
				</Form.Item>
			</Form>

			<div className="status">
				{status}
			</div>
		</Card>
	)
}
