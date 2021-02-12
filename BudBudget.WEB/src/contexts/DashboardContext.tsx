import { createContext, useContext } from "react";

interface MonthlyData {
	month: string,
	monthValue: number,
	type: string 
}

interface MonthlyDataContainer {
	monthlyData: MonthlyData,
	setMonthlyData: React.Dispatch<React.SetStateAction<MonthlyData>>
}

interface CategoryValues {
	categoryName: string,
	categoryValue: number
}

interface CategoryValuesContainer {
	categoryValues: CategoryValues,
	setMonthlyData: React.Dispatch<React.SetStateAction<CategoryValues>>
}

interface DashboardContextData {
	categoryValues?: CategoryValuesContainer[],
	monthlyData?: MonthlyDataContainer[]
}

export interface DashboardContext {
	dashboardContext?: DashboardContextData,
	setDashboardContext?: React.Dispatch<React.SetStateAction<DashboardContextData>>
}

export const DashboardContext = createContext<DashboardContext>({});

export function useLoginContext(): DashboardContext {
	return useContext(DashboardContext);
}
