const AddExpenseForm = ():JSX.Element => (
	<form>
		<div className="row">
			<div className="col-sm">
				<label htmlFor="name">
					Name
				</label>
				<input
					required={true}
					type="text"
					className="form-control"
					id="name" />
			</div>
			<div className="col-sm">
				<label htmlFor="Cost">
					Cost
				</label>
				<input
					required={true}
					type="text"
					className="form-control"
					id="cost" />
			</div>
		</div>
		<div className="row mt-3">
			<div className="col-sm">
				<button
					type="submit"
					className="btn btn-primary">
					Save
				</button>
			</div>
		</div>
	</form>
);

export default AddExpenseForm;
