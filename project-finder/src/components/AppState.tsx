"use client";

import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
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
		localStorage.setItem("_userId", value.userId || "");
	};

	useEffect(() => {
		let isMounted = true;

		const hydrateAccountInfo = async () => {
			const jwt = localStorage.getItem("_jwt");
			const refreshToken = localStorage.getItem("_refreshToken");

			if (!jwt || !refreshToken) {
				if (isMounted) {
					setAccountInfo({});
				}
				return;
			}

			const accountService = new AccountService();
			const userInfo = await accountService.getCurrentUserInfoAsync();

			if (!isMounted) {
				return;
			}

			if (userInfo.errors || !userInfo.data) {
				setAccountInfo({});
				return;
			}

			setAccountInfo({
				jwt,
				refreshToken,
				firstName: userInfo.data.firstName,
				lastName: userInfo.data.lastName,
				role: userInfo.data.role,
				userId: userInfo.data.id,
			});
		};

		hydrateAccountInfo();

		return () => {
			isMounted = false;
		};
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
