import { IInvitation } from "@/types/domain/IInvitation";
import {
	ButtonGroup,
	Heading,
	STATUS_TYPE,
	StatusTag,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";

interface InvitationCardProps {
	invite: IInvitation;
	onAccept: (id: string) => void;
	onDecline: (id: string) => void;
}

function formatDateTime(value: string) {
	return new Date(value).toLocaleString("et-EE");
}

export default function InvitationCard({
	invite,
	onAccept,
	onDecline,
}: InvitationCardProps) {
	return (
		<TTNewCard className="mb-4">
			<TTNewCardContent>
				<Heading as="h3" visual="h5">
					{invite.group.name}
				</Heading>
				<p>
					Saatja: {invite.fromUser.firstName}{" "}
					{invite.fromUser.lastName} ({invite.fromUser.email})
				</p>
				{invite.group.users && invite.group.users.length > 0 && (
					<div className="mt-3 mb-3">
						<p>Grupi liikmed:</p>
						{invite.group.users.map((usergroup) => (
							<StatusTag
								key={usergroup.id}
								type={STATUS_TYPE.INFO}
							>
								{usergroup.user.firstName}{" "}
								{usergroup.user.lastName} (
								{usergroup.user.email}) - {usergroup.role}
							</StatusTag>
						))}
					</div>
				)}
				<p>Teie roll: {invite.role}</p>
				{!invite.acceptedAt && !invite.declinedAt && (
					<div className="mt-3">
						<ButtonGroup>
							<TTNewButton
								className="mr-4"
								variant="primary"
								size="sm"
								onClick={() => onAccept(invite.id)}
							>
								Aktsepteeri
							</TTNewButton>
							<TTNewButton
								variant="danger"
								size="sm"
								onClick={() => onDecline(invite.id)}
							>
								Lükka tagasi
							</TTNewButton>
						</ButtonGroup>
					</div>
				)}
				{invite.acceptedAt && (
					<p className="mt-3">
						Kutse vastu võetud {formatDateTime(invite.acceptedAt)}
					</p>
				)}
				{invite.declinedAt && (
					<p className="mt-3">
						Kutse tagasi lükatud {formatDateTime(invite.declinedAt)}
					</p>
				)}
			</TTNewCardContent>
		</TTNewCard>
	);
}
