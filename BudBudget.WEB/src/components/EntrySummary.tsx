import { Button, Card, Form, Input } from 'antd'
import React from 'react'
import { TableEntry } from '../containers/TransactionsContainer'

export default function EntrySummary(props: {
	entry: TableEntry,
	setEntryEditing: React.Dispatch<React.SetStateAction<TableEntry | undefined>>
}) {
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
			title="Edit Entry"
		>
			<Form
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
						type="primary"
						htmlType="submit"
					>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}
