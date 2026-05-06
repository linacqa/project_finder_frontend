"use client";

import { AccountContext } from "@/context/AccountContext";
import { UserService } from "@/services/UserService";
import { IUserInfo } from "@/types/IUserInfo";
import { useRouter } from "next/dist/client/components/navigation";
import { use, useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	ButtonGroup,
	TTNewAlert,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";

export default function ProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const userId = use(params).id;
	const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const userService = new UserService();

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.isAuthenticated) {
			router.push("/login");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		const fetchUserInfo = async () => {
			setMessage({type: "loading", text: "Kasutaja info laadimine..."});
			const result = await userService.getUserByIdAsync(userId);
			if (result && result.data) {
				setUserInfo(result.data);
				setMessage(null);
			} else {
				setMessage({
					type: "error",
					text: `Kasutajat ei leitud. (${result.errors?.join(", ")})`,
				});
			}
		};

		fetchUserInfo();
	}, [userId]);

	return (
		<TTNewContainer>
			{message && (
				<div>
					<TTNewAlert
						position={ALERT_POSITION_TYPES.INLINE}
						variant={
							message.type === "error"
								? ALERT_STATUS_TYPE.ERROR
								: message.type === "success"
									? ALERT_STATUS_TYPE.SUCCESS
									: ALERT_STATUS_TYPE.INFO
						}
						dismissible
						size={ALERT_SIZE.SMALL}
						title={message.text}
						onClose={() => setMessage(null)}
					></TTNewAlert>
				</div>
			)}
			<h1>Profiil</h1>

			{userInfo ? (
				<TTNewCard className="mb-3">
					<TTNewCardContent>
						<h5>
							Nimi: {userInfo.firstName} {userInfo.lastName}
						</h5>
						<h5>Email: {userInfo.email}</h5>
						{userInfo.phoneNumber && (
							<h5>Telefoninumber: {userInfo.phoneNumber}</h5>
						)}
						<h5>Roll: {userInfo.role}</h5>
						{userInfo.uniId && <h5>Uni-ID: {userInfo.uniId}</h5>}
						{userInfo.matriculationNumber && (
							<h5>
								Matriklinumber: {userInfo.matriculationNumber}
							</h5>
						)}
						{userInfo.program && (
							<h5>Õppekava: {userInfo.program}</h5>
						)}
					</TTNewCardContent>
				</TTNewCard>
			) : (
				<p>Kasutajat ei leitud.</p>
			)}
			{userId === accountInfo?.userId && (
				<ButtonGroup className="mb-3">
					<TTNewButton onClick={() => router.push("/editProfile")}>
						Muuda andmeid
					</TTNewButton>
				</ButtonGroup>
			)}
		</TTNewContainer>
	);
}
