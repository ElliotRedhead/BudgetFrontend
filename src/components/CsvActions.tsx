import { ChangeEvent, useContext, useRef, useState } from "react";
import { API_ROOT } from "../constants";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import useAxios from "../hooks/useAxios";
import { authHeaders } from "../utilities/authHeaders";
import { toMonthParam } from "../utilities/months";

const CsvActions = (): JSX.Element => {
	const { state, refresh } = useContext(ExpenseDataContext);
	const exportRequest = useAxios();
	const importRequest = useAxios();
	const fileInput = useRef<HTMLInputElement>(null);
	const [importMessage, setImportMessage] = useState<string>();
	const month = toMonthParam(state.month);

	const exportCsv = async () => {
		const exported = await exportRequest.operation({
			method: "get",
			url: `${API_ROOT}/expenses/export/`,
			params: { month },
			responseType: "blob",
			headers: authHeaders()
		});
		if (exported){
			const downloadUrl = URL.createObjectURL(exported.data);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = `expenses-${month}.csv`;
			link.click();
			URL.revokeObjectURL(downloadUrl);
		}
	};

	const importCsv = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file){
			return;
		}
		setImportMessage(undefined);
		const upload = new FormData();
		upload.append("file", file);
		const imported = await importRequest.operation({
			method: "post",
			url: `${API_ROOT}/expenses/import/`,
			data: upload,
			headers: authHeaders()
		});
		event.target.value = "";
		if (imported){
			const importedCount = imported.data.created;
			setImportMessage(`Imported ${importedCount} ${importedCount === 1 ? "expense" : "expenses"}.`);
			refresh();
		}
	};

	return (
		<div className="mt-3">
			<div className="d-flex flex-wrap gap-2">
				<button
					type="button"
					className="btn btn-outline-secondary btn-sm"
					disabled={exportRequest.loading}
					onClick={exportCsv}>
					Export this month as CSV
				</button>
				<button
					type="button"
					className="btn btn-outline-secondary btn-sm"
					disabled={importRequest.loading}
					onClick={() => fileInput.current?.click()}>
					Import from CSV
				</button>
				<input
					ref={fileInput}
					type="file"
					accept=".csv,text/csv"
					className="d-none"
					aria-label="CSV file to import"
					onChange={importCsv} />
			</div>
			<div
				className="small mt-1"
				role="status">
				{importMessage}
				{
					(exportRequest.error || importRequest.error) &&
					<span className="text-danger">
						{exportRequest.error ?? importRequest.error}
					</span>
				}
			</div>
			<div className="small text-muted">
				Columns: date, name, category, cost (in pounds).
			</div>
		</div>
	);
};

export default CsvActions;
