/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import { ModalContextType } from "../types/ModalContextType";
import { toDateTimeInputValue } from "../utilities/dateTimeInput";

const InitialModalContext:ModalContextType = {
	resetContext: () => {},
	modalVisibility: false,
	toggleModalVisibility: () => {},
	expenseId: null,
	expenseIdSetter: (id: number | null) => {},
	expenseName: "",
	expenseNameSetter: (name:string) => {},
	expenseCost: 0,
	expenseCostSetter: (cost:number) => {},
	expenseCategory: "other",
	expenseCategorySetter: (category: string) => {},
	expenseDate: toDateTimeInputValue(new Date().toISOString()),
	expenseDateSetter: (date:string) => {}
};

const ModalContext = createContext(InitialModalContext);

export default ModalContext;
