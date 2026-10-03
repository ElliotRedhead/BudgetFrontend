export interface ModalContextType {
	resetContext: () => void;
	modalVisibility: boolean;
	toggleModalVisibility: () => void;

	/** The expense being edited, or null when adding a new one. */
	expenseId: number | null;
	expenseIdSetter: (id: number | null) => void;
	expenseName: string;
	expenseNameSetter: (name:string) => void;
	expenseCost: number;
	expenseCostSetter: (cost:number) => void;
	expenseCategory: string;
	expenseCategorySetter: (category: string) => void;
	expenseDate: string;
	expenseDateSetter: (date:string) => void;
}
