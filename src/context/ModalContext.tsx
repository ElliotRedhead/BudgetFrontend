/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import { ModalContextType } from "../types/ModalContextType";

const InitialModalContext:ModalContextType = {
	resetContext: () => {},
	modalVisibility: false,
	toggleModalVisibility: () => {},
	expenseId: "",
	expenseIdSetter: (id:string) => {},
	expenseName: "",
	expenseNameSetter: (name:string) => {},
	expenseCost: 0,
	expenseCostSetter: (cost:number) => {}
};

const ModalContext = createContext(InitialModalContext);

export default ModalContext;
