import { useState } from "react";
import AuthenticationForm from "../components/AuthenticationForm";
import "../styles/authentication.scss";

interface AuthenticationProps {
	authMode: string
}

const Authentication = ({ authMode }:AuthenticationProps) => (
	<AuthenticationForm
		authMode={authMode} />
);


export default Authentication;
