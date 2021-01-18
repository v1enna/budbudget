import React from "react";
import { useLoginContext } from "../contexts/LoginContext";

export default function TransactionsContainer() {
	const loginContext = useLoginContext();

	return (
		<div>
			Sono le transazioni e sono loggato?{" "}
			{loginContext.isLoggedIn ? "si" : "no"}
		</div>
	);
}
