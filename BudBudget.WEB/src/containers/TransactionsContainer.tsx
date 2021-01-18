import React, { useEffect, useState } from "react";
import { useLoginContext } from "../contexts/LoginContext";
import { Entry } from "../models/Entry";
import { getEntries } from "../services/DataService";

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

	return (
		<div>
			Sono le transazioni e sono loggato?{" "}
			{loginContext.isLoggedIn ? "si" : "no"}
			{JSON.stringify(entries)}
		</div>
	);
}
