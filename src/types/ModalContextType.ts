export interface ModalContextType {
	resetContext: () => void;
	modalVisibility: boolean;
	toggleModalVisibility: () => void;
	expenseId: string;
	expenseIdSetter: (id:string) => void;
	expenseName: string;
	expenseNameSetter: (name:string) => void;
	expenseCost: number;
	expenseCostSetter: (cost:number) => void;
	expenseDate: string;
	expenseDateSetter: (date:string) => void;
}
