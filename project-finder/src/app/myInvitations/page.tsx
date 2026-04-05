"use client";

import { useEffect, useState } from "react";
import {
	TTNewContainer,
	TTNewCard,
	TTNewCardContent,
	Heading,
	TTNewButton,
	StatusTag,
	STATUS_TYPE,
} from "taltech-styleguide";
import { IInvitation } from "@/types/domain/IInvitation";
import { InvitationService } from "@/services/InvitationService";

export default function MyInvitationsPage() {
	const [invitations, setInvitations] = useState<IInvitation[]>([]);
	const [loading, setLoading] = useState(false);

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
		const invitationService = new InvitationService();
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
				<TTNewCard key={invite.id} className="mb-4">
					<TTNewCardContent>
						<Heading as="h3" visual="h5">
							{invite.group.name}
						</Heading>
						<p>
							Saatja: {invite.fromUser.firstName}{" "}
							{invite.fromUser.lastName} ({invite.fromUser.email})
						</p>
						{invite.group.users &&
							invite.group.users.length > 0 && (
								<div className="mt-3 mb-3">
									<p>Grupi liikmed:</p>
									{invite.group.users.map((usergroup) => (
										<StatusTag
											key={usergroup.id}
											type={STATUS_TYPE.INFO}
										>
											{usergroup.user.firstName}{" "}
											{usergroup.user.lastName} (
											{usergroup.user.email}) -{" "}
											{usergroup.role}
										</StatusTag>
									))}
								</div>
							)}
						<p>Teie roll: {invite.role}</p>
						{!invite.acceptedAt && !invite.declinedAt && (
							<div className="mt-3">
								<TTNewButton
									className="mr-4"
									variant="primary"
									size="sm"
									onClick={() => handleAccept(invite.id)}
								>
									Accept
								</TTNewButton>
								<TTNewButton
									variant="danger"
									size="sm"
									onClick={() => handleDecline(invite.id)}
								>
									Decline
								</TTNewButton>
							</div>
						)}
						{invite.acceptedAt && (
							<p className="mt-3">
								Kutse vastu võetud {new Date(invite.acceptedAt).toLocaleString()}
							</p>
						)}
						{invite.declinedAt && (
							<p className="mt-3">
								Kutse tagasi lükatud {new Date(invite.declinedAt).toLocaleString()}
							</p>
						)}
					</TTNewCardContent>
				</TTNewCard>
			))}
		</TTNewContainer>
	);
}
