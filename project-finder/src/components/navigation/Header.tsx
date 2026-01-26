"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { AccountContext } from "@/context/AccountContext";

const HeaderStyleguide = dynamic(
	() => import("taltech-styleguide").then((mod) => mod.Header),
	{ ssr: false },
);

export default function Header() {
	const { accountInfo, setAccountInfo } = useContext(AccountContext);

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		// localStorage.removeItem('_jwt');
		// localStorage.removeItem('_refreshToken');
		setAccountInfo!({});
	};

	return (
		<>
			<HeaderStyleguide
				links={[
					{
						active: true,
						children: "Lõputööde süsteem",
						items: [
							{ children: "All Final Theses", href: "/" },
							{
								children: "Declare New Final Thesis Idea",
								href: "/declare-thesis",
							},
						],
						href: "/",
					},
				]}
				logoLink={{
					children: "Logo aria",
					href: "https://ttu.ee",
					target: "_blank",
				}}
				profile={
					accountInfo
						? {
								links: [
									{
										children: "Minu lõputöö(-d)",
										href: "/my-thesis",
									},
									{
										children: "Logi välja",
										href: "/",
										onClick: handleLogout,
									},
								],
								// onLanguageSwitch: function handleLanguageSwitch() {console.log("Switch")},

								profile: {
									firstName: `${accountInfo.firstName} ${accountInfo.lastName}`,
									photo: "/user.png",
								},
							}
						: {
								links: [
									{ children: "Logi sisse", href: "/login" },
								],
								profile: {
									firstName: "Logi sisse",
									photo: "/user.png",
								},
							}
				}
				linkAs={({
					href,
					children,
					...props
				}: {
					href: string;
					children: React.ReactNode;
				}) => (
					<Link href={href} {...props}>
						{children}
					</Link>
				)}
			/>
			<ToastContainer />
		</>
	);
}
