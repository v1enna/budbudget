import React from "react";
import { Route, Switch } from "react-router-dom";
import TransactionsContainer from "./containers/TransactionsContainer";

export default function Routes() {
	return (
		<Switch>
			<Route path="/transactions" component={TransactionsContainer} />
			{/* <Route path="/reports" component={ReportsContainer} /> */}

			<Route path="/" component={TransactionsContainer} />

			<Route>
				<div>404 pagina non trovata</div>
			</Route>
		</Switch>
	);
}
