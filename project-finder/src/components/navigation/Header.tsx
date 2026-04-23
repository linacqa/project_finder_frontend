"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { AccountContext } from "@/context/AccountContext";
import { useRouter } from "next/navigation";

const HeaderStyleguide = dynamic(
	() => import("taltech-styleguide").then((mod) => mod.Header),
	{ ssr: false },
);

export default function Header() {
	const { accountInfo, setAccountInfo } = useContext(AccountContext);

	const router = useRouter();

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		setAccountInfo!({});
		router.push("/login");
	};

	return (
		<>
			<HeaderStyleguide
				links={[
					{
						active: true,
						children: "Projektide süsteem",
						items: [
							...(accountInfo?.jwt
								? [
										{
											children:
												"Esita uus projekti idee",
											href: "/submitIdea",
										},
									]
								: []),
							...(accountInfo?.jwt
								? // &&
									// (accountInfo.role === "student" ||
									// 	accountInfo.role === "teacher")
									[
										{
											children: "Projektid",
											href: "/",
										},
									]
								: []),
							...(accountInfo?.jwt &&
							accountInfo.role === "student"
								? [
										{
											children: "Grupid",
											href: "/groups",
										},
									]
								: []),
							...(accountInfo?.jwt && accountInfo.role === "admin"
								? [
										{
											children: "Lisa uus projekt",
											href: "/admin/addEditProject",
										},
										{
											children: "Kandideerimised",
											href: "/admin/applications",
										},
										{
											children: "Sildid",
											href: "/admin/tags",
										},
										{
											children: "Etapid",
											href: "/admin/steps",
										},
										{
											children: "Kasutajad",
											href: "/admin/users",
										},
									]
								: []),
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
					accountInfo?.jwt
						? {
								links: [
									{
										children: "Profiil",
										href: `/profile/${accountInfo.userId}`,
									},
									{
										children: "Minu projektid",
										href: "/myProjects",
									},
									...(accountInfo.role === "student"
										? [
												{
													children: "Minu kutsed",
													href: "/myInvitations",
												},
											]
										: []),
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
