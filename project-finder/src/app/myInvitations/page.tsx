"use client";

import { useEffect, useState } from "react";
import {
	TTNewContainer,
	Heading,
} from "taltech-styleguide";
import { IInvitation } from "@/types/domain/IInvitation";
import { InvitationService } from "@/services/InvitationService";
import InvitationCard from "@/components/invitations/InvitationCard";

export default function MyInvitationsPage() {
	const [invitations, setInvitations] = useState<IInvitation[]>([]);
	const [loading, setLoading] = useState(false);

	const invitationService = new InvitationService();

	const handleAccept = async (id: string) => {
		const invitationService = new InvitationService();
		const res = await invitationService.acceptByIdAsync(id);
		console.log(res);

		if (res && res.statusCode && res.statusCode <= 300) {
			// TODO
			console.log("Invitation accepted successfully", res.data);
		}
	};

	const handleDecline = async (id: string) => {
		const invitationService = new InvitationService();
		const res = await invitationService.declineByIdAsync(id);

		if (res && res.statusCode && res.statusCode <= 300) {
			// TODO
			console.log("Invitation declined successfully", res.data);
		}
	};

	useEffect(() => {
		setLoading(true);

		invitationService
			.getAllAsync()
			.then((res) => {
				if (res && res.data) {
					setInvitations(res.data);
					console.log("Fetched invitations:", res.data);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<TTNewContainer>
			<Heading as="h1" visual="h2">
				Minu kutsed
			</Heading>
			<p>Siin näed kõiki kutseid, mis sulle on saadetud.</p>

			{loading && <div>Laadin...</div>}
			{!loading && invitations.length === 0 && <p>Ühtegi kutset pole.</p>}

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
