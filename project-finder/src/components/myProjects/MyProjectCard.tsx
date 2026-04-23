import { IApplication } from "@/types/domain/IApplication";
import { IProject } from "@/types/domain/IProject";
import Link from "next/link";
import {
	Heading,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";
import ConfirmationModal from "../modal/ConfirmationModal";
import { useContext, useState } from "react";
import { AccountContext } from "@/context/AccountContext";

export default function MyProjectCard({
	application,
	project,
	type,
	onDeleteApplication,
}: {
	application: IApplication | null;
	project: IProject | null;
	type: "application" | "project";
	onDeleteApplication: (applicationId: string) => void;
}) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { accountInfo } = useContext(AccountContext);

	const getRole = (role: string) => {
		if (role === "Author") return "Autor";
		if (role === "Supervisor") return "Peamine juhendaja";
		if (role === "External Supervisor") return "Kaasjuhendaja";
		if (role === "Executor") return "Tegeleja";
		return role;
	}

	return type === "application" ? (
		<TTNewCard key={application?.id} className="mb-4">
			<TTNewCardContent>
				<Heading as="h3" visual="h5" className="project-header-title">
					<Link href={`/project/${application?.projectId}`}>
						{application?.project?.titleInEstonian}
					</Link>
				</Heading>
				<Heading as="h4" visual="h6" className="project-header-title">
					{application?.project?.titleInEnglish}
				</Heading>
				{application?.group && (
					<p className="project-header-title">
						Kandideeritav grupp:{" "}
						<Link href={`/groups/${application?.groupId}`}>
							{application?.group.name}
						</Link>
					</p>
				)}
				{application?.acceptedAt && (
					<p className="mt-3">
						Vastu võetud{" "}
						{new Date(application.acceptedAt).toLocaleString()}
					</p>
				)}
				{application?.declinedAt && (
					<p className="mt-3">
						Tagasi lükatud{" "}
						{new Date(application.declinedAt).toLocaleString()}
					</p>
				)}
				{!application?.acceptedAt && !application?.declinedAt && (
					<p className="mt-3">Kandideerimine on ootel</p>
				)}
				{!application?.acceptedAt && application?.id && (
					<>
						<TTNewButton
							variant="danger"
							size="sm"
							onClick={() => setShowDeleteModal(true)}
						>
							Kustuta
						</TTNewButton>

						<ConfirmationModal
							show={showDeleteModal}
							hideAction={() => setShowDeleteModal(false)}
							title="Kas olete kindel?"
							text="Kas soovite selle kandideerimist jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
							confirmText="Jah, kustuta"
							confirmAction={() =>
								onDeleteApplication(application?.id)
							}
						/>
					</>
				)}
			</TTNewCardContent>
		</TTNewCard>
	) : (
		<TTNewCard key={project?.id} className="mb-4">
			<TTNewCardContent>
				<Heading as="h3" visual="h5" className="project-header-title">
					<Link href={`/project/${project?.id}`}>
						{project?.titleInEstonian}
					</Link>
				</Heading>
				<Heading as="h4" visual="h6" className="project-header-title">
					{project?.titleInEnglish}
				</Heading>
				<p className="mt-3">Roll: {getRole(project?.users.find((u) => u.userId === accountInfo?.userId)?.userProjectRole.name || "")}</p>
			</TTNewCardContent>
		</TTNewCard>
	);
}
