import { IApplication } from "@/types/domain/IApplication";
import { IGroup } from "@/types/domain/IGroup";
import { IProject } from "@/types/domain/IProject";
import Link from "next/link";
import {
	CustomInput,
	Heading,
	Tag,
	TagVariants,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewSelect,
} from "taltech-styleguide";
import ConfirmationModal from "../modal/ConfirmationModal";
import { useState } from "react";

interface ApplicationCardProps {
	isStudent: boolean;
	application: IApplication | null;
	project: IProject | null;
	isGroupApplication: boolean;
	setIsGroupApplication: (value: boolean) => void;
	groups: IGroup[];
	selectedGroupId: { label: string; value: string } | null;
	setSelectedGroupId: (
		value: { label: string; value: string } | null,
	) => void;
	onApply: () => void;
	onDelete: (applicationId: string) => void;
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("et-EE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export default function ApplicationCard({
	isStudent,
	application,
	project,
	isGroupApplication,
	setIsGroupApplication,
	groups,
	selectedGroupId,
	setSelectedGroupId,
	onApply,
	onDelete,
}: ApplicationCardProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	if (!isStudent) {
		return null;
	}

	const handleDeleteApplication = (applicationId: string) => {
		setShowDeleteModal(false);
		onDelete(applicationId);
	};

	return (
		<TTNewCard className="mb-3">
			<TTNewCardContent>
				<div className="d-flex flex-column gap-1">
					{!application &&
						project?.projectStatus.name === "Avatud" && (
							<>
								<CustomInput
									className="mb-2"
									label="Kandideeri grupina"
									type="checkbox"
									checked={isGroupApplication}
									onChange={(e) =>
										setIsGroupApplication(e.target.checked)
									}
								/>
								{isGroupApplication &&
									project?.maxStudents &&
									project.maxStudents >= 2 && (
										<TTNewSelect
											className="mb-3"
											options={groups.map((group) => ({
												value: group.id,
												label: group.name,
											}))}
											placeholder="Vali grupp"
											value={selectedGroupId}
											onChange={(value) =>
												setSelectedGroupId(value)
											}
										/>
									)}
								{project?.minStudents === 1 && (
									<TTNewButton onClick={onApply}>
										Kandideeri
									</TTNewButton>
								)}
							</>
						)}
					{application && (
						<>
							<Heading as="h3" visual="h6">
								Teie kandideerimine:
							</Heading>
							{application.group && (
								<p>
									Grupiga:{" "}
									<Link
										href={`/groups/${application.group.id}`}
									>
										{application.group.name}
									</Link>
								</p>
							)}
							<div className="mb-3">
								{!application.acceptedAt &&
									!application.declinedAt && (
										<Tag
											text="Ootel"
											variant={TagVariants.WARNING}
										/>
									)}
								{application.acceptedAt && (
									<Tag
										text={`Aktsepteeritud ${formatDate(application.acceptedAt)}`}
										variant={TagVariants.SUCCESS_FILLED}
									/>
								)}
								{application.declinedAt && (
									<Tag
										text={`Tagasi lükatud ${formatDate(application.declinedAt)}`}
										variant={TagVariants.DANGER_FILLED}
									/>
								)}
							</div>
							{!application.acceptedAt && (
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
										hideAction={() =>
											setShowDeleteModal(false)
										}
										title="Kas olete kindel?"
										text="Kas soovite selle kandideerimist jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
										confirmText="Jah, kustuta"
										confirmAction={() =>
											handleDeleteApplication(application.id)
										}
									/>
								</>
							)}
						</>
					)}
				</div>
			</TTNewCardContent>
		</TTNewCard>
	);
}
