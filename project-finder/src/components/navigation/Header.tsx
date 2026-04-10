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
		// localStorage.removeItem("_jwt");
		// localStorage.removeItem("_refreshToken");
		// localStorage.removeItem("_firstName");
		// localStorage.removeItem("_lastName");
		// localStorage.removeItem("_role");
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
							{ children: "Home", href: "/" },
							...(accountInfo?.jwt
								? [
										{
											children: "Submit New Project Idea",
											href: "/submitIdea",
										},
									]
								: []),
							...(accountInfo?.jwt &&
							(accountInfo.role === "student" ||
								accountInfo.role === "teacher")
								? [
										{
											children: "All Projects",
											href: "/allProjects",
										},
									]
								: []),
							...(accountInfo?.jwt &&
							(accountInfo.role === "student")
								? [
										{
											children: "Groups",
											href: "/groups",
										},
									]
								: []),
							...(accountInfo?.jwt && accountInfo.role === "admin"
								? [
										{
											children: "All Projects",
											href: "/admin/allProjects",
										},
										{
											children: "Add New Project",
											href: "/admin/addProject",
										},
										{
											children: "Applications",
											href: "/admin/applications",
										},
										{
											children: "Tags",
											href: "/admin/tags",
										},
										{
											children: "Steps",
											href: "/admin/steps",
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
										children: "Minu lõputöö(-d)",
										href: "/my-thesis",
									},
									{
										children: "Minu kutsed",
										href: "/myInvitations",
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
