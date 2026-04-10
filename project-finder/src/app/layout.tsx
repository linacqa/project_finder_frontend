"use client";
import "taltech-styleguide/index.css";
import "./globals.css";

import Header from "@/components/navigation/Header";
import dynamic from "next/dynamic";

// export const metadata = {
// 	title: "Projektid | IT Kolledž",
// 	description: "Praktika projektide infosüsteem IT Kolledži jaoks.",
// };

const AppState = dynamic(() => import("@/components/AppState"), { ssr: false });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="et">
			<head>
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>Projektid | IT Kolledž</title>
			</head>
			<body>
				<AppState>
					<Header />
					<main className="container">
						{children}
					</main>
				</AppState>
			</body>
		</html>
	);
}
