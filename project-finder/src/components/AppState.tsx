"use client";

import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { useEffect, useState } from "react";
import { ConfigProvider } from "taltech-styleguide";

export default function AppState({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>();
	const updateAccountInfo = (value: IAccountInfo) => {
		setAccountInfo(value);
		localStorage.setItem("_jwt", value.jwt!);
		localStorage.setItem("_refreshToken", value.refreshToken!);
		localStorage.setItem("_firstName", value.firstName || "");
		localStorage.setItem("_lastName", value.lastName || "");
		localStorage.setItem("_role", value.role || "");
	};

	useEffect(() => {
		const firstName = localStorage.getItem("_firstName");
		const lastName = localStorage.getItem("_lastName");
		const role = localStorage.getItem("_role");
		const jwt = localStorage.getItem("_jwt");
		const refreshToken = localStorage.getItem("_refreshToken");

		if (jwt && refreshToken && firstName && lastName && role) {
			setAccountInfo({
				jwt,
				refreshToken,
				firstName: firstName || undefined,
				lastName: lastName || undefined,
				role: (role as IAccountInfo["role"]) || undefined,
			});
		} else {
			setAccountInfo({});
		}
	}, []);

	return (
		<AccountContext.Provider
			value={{
				accountInfo: accountInfo,
				setAccountInfo: updateAccountInfo,
			}}
		>
			<ConfigProvider>{children}</ConfigProvider>
		</AccountContext.Provider>
	);
}
