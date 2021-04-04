import React from "react";
import { Route, Switch } from "react-router-dom";
import DashboardContainer from "./containers/DashboardContainer";
import ReportsContainer from "./containers/ReportsContainer";
import TransactionsContainer from "./containers/TransactionsContainer";

export default function Routes() {
	return (
		<Switch>
			<Route path="/transactions" component={TransactionsContainer} />

			<Route path="/reports" component={ReportsContainer} />

			<Route exact path="/" component={DashboardContainer} />

			<Route>
				<div>404 pagina non trovata</div>
			</Route>
		</Switch>
	);
}
