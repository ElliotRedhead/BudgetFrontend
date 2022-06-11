/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { createContext } from "react";

const ModalContext = createContext({
	modalVisibility: false,
	toggleModalVisibility: () => {},
	expenseId: "",
	expenseIdSetter: (id:string) => {},
	expenseName: "",
	expenseNameSetter: (name:string) => {},
	expenseCost: 0,
	expenseCostSetter: (cost:number) => {}
});

export default ModalContext;