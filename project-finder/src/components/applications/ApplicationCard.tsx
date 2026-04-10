import { IApplication } from "@/types/domain/IApplication";
import Link from "next/link";
import {
	Heading,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";

export default function ApplicationCard({
	application,
	handleAccept,
	handleDecline,
}: {
	application: IApplication;
	handleAccept: (id: string) => void;
	handleDecline: (id: string) => void;
}) {
	return (
		<TTNewCard key={application.id} className="mb-4">
			<TTNewCardContent>
				<Heading as="h3" visual="h5">
					<Link href={`/project/${application.projectId}`}>
						{application.project?.titleInEstonian}
					</Link>
				</Heading>
				<Heading as="h4" visual="h6">
					{application.project?.titleInEnglish}
				</Heading>
				<p>
					Kandideerimise autor: {application.user?.firstName}{" "}
					{application.user?.lastName} ({application.user?.email})
				</p>
				{application.group && (
					<p>
						Kandideeritav grupp: {" "}
						<Link href={`/groups/${application.groupId}`}>
							{application.group.name}
						</Link>
					</p>
				)}
				{!application.acceptedAt && !application.declinedAt && (
					<div className="mt-3">
						<TTNewButton
							className="mr-4"
							variant="primary"
							size="sm"
							onClick={() => handleAccept(application.id)}
						>
							Accept
						</TTNewButton>
						<TTNewButton
							variant="danger"
							size="sm"
							onClick={() => handleDecline(application.id)}
						>
							Decline
						</TTNewButton>
					</div>
				)}
				{application.acceptedAt && (
					<p className="mt-3">
						Kutse vastu võetud{" "}
						{new Date(application.acceptedAt).toLocaleString()}
					</p>
				)}
				{application.declinedAt && (
					<p className="mt-3">
						Kutse tagasi lükatud{" "}
						{new Date(application.declinedAt).toLocaleString()}
					</p>
				)}
			</TTNewCardContent>
		</TTNewCard>
	);
}
