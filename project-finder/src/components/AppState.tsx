"use client";

import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { useState } from "react";
import { ConfigProvider } from "taltech-styleguide";

export default function AppState({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>();
	const updateAccountInfo = (value: IAccountInfo) => {
		setAccountInfo(value);
		localStorage.setItem("_jwt", value.jwt!);
		localStorage.setItem("_refreshToken", value.refreshToken!);
	};

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
