import { createContext } from "react";

const ModalContext = createContext({
	modalVisibility: false,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleModalVisibility: () => {} });

export default ModalContext;
