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
	};

	useEffect(() => {
		let isMounted = true;

		const hydrateAccountInfo = async () => {
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
				firstName: userInfo.data.firstName,
				lastName: userInfo.data.lastName,
				role: userInfo.data.role,
				userId: userInfo.data.id,
				email: userInfo.data.email,
				isAuthenticated: true,
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
