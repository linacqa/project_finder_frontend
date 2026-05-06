"use client";

import { useContext, useEffect, useState } from "react";
import {
	TTNewContainer,
	Heading,
	TTNewAlert,
	ALERT_POSITION_TYPES,
	ALERT_STATUS_TYPE,
	ALERT_SIZE,
} from "taltech-styleguide";
import { IInvitation } from "@/types/domain/IInvitation";
import { InvitationService } from "@/services/InvitationService";
import InvitationCard from "@/components/invitations/InvitationCard";
import { useRouter } from "next/dist/client/components/navigation";
import { AccountContext } from "@/context/AccountContext";

export default function MyInvitationsPage() {
	const [invitations, setInvitations] = useState<IInvitation[]>([]);

	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const invitationService = new InvitationService();

	const handleAccept = async (id: string) => {
		setMessage({ type: "loading", text: "Aktsepteerin kutset..." });
		const res = await invitationService.acceptByIdAsync(id);

		if (res && res.statusCode && res.statusCode <= 300) {
			setInvitations((prev) => prev.filter((invite) => invite.id !== id));
			setMessage({ type: "success", text: "Kutse aktsepteeritud." });
			invitationService.getAllAsync().then((res) => {
				if (res.data) {
					setInvitations(res.data);
				}
			});
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	const handleDecline = async (id: string) => {
		setMessage({ type: "loading", text: "Keeldun kutsest..." });
		const res = await invitationService.declineByIdAsync(id);

		if (res && res.statusCode && res.statusCode <= 300) {
			setInvitations((prev) => prev.filter((invite) => invite.id !== id));
			setMessage({ type: "success", text: "Kutsest keelduti." });
			invitationService.getAllAsync().then((res) => {
				if (res.data) {
					setInvitations(res.data);
				}
			});
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.isAuthenticated) {
			router.push("/login");
			return;
		}
		if (accountInfo.role !== "student" && accountInfo.role !== "admin") {
			router.push("/");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		setMessage({ type: "loading", text: "Laadin kutseid..." });

		invitationService.getAllAsync().then((res) => {
			if (res.data) {
				setInvitations(res.data);
				setMessage(null);
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	}, []);

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
			<Heading as="h1" visual="h2">
				Minu kutsed
			</Heading>
			<p>Siin näed kõiki kutseid, mis sulle on saadetud.</p>

			{invitations.length === 0 && <p>Ühtegi kutset pole.</p>}

			{invitations.map((invite) => (
				<InvitationCard
					key={invite.id}
					invite={invite}
					onAccept={handleAccept}
					onDecline={handleDecline}
				/>
			))}
		</TTNewContainer>
	);
}
