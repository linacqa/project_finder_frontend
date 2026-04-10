import { IApplication } from "@/types/domain/IApplication";
import { IGroup } from "@/types/domain/IGroup";
import { IProject } from "@/types/domain/IProject";
import Link from "next/link";
import { CustomInput, Heading, Tag, TagVariants, TTNewButton, TTNewCard, TTNewCardContent, TTNewSelect } from "taltech-styleguide";

interface ApplicationCardProps {
	isStudent: boolean;
	application: IApplication | null;
	project: IProject | null;
	isGroupApplication: boolean;
	setIsGroupApplication: (value: boolean) => void;
	groups: IGroup[];
	selectedGroupId: { label: string; value: string } | null;
	setSelectedGroupId: (value: { label: string; value: string } | null) => void;
	onApply: () => void;
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
}: ApplicationCardProps) {
	if (!isStudent) {
		return null;
	}

	return (
		<TTNewCard className="mb-3">
			<TTNewCardContent>
				<div className="d-flex flex-column gap-1">
					{!application && (
						<>
							<CustomInput
								className="mb-2"
								label="Kandideeri grupina"
								type="checkbox"
								checked={isGroupApplication}
								onChange={(e) => setIsGroupApplication(e.target.checked)}
							/>
							{isGroupApplication && project?.maxStudents && project.maxStudents >= 2 && (
								<TTNewSelect
									className="mb-3"
									options={groups.map((group) => ({
										value: group.id,
										label: group.name,
									}))}
									placeholder="Vali grupp"
									value={selectedGroupId}
									onChange={(value) => setSelectedGroupId(value)}
								/>
							)}
							{project?.minStudents === 1 && (
								<TTNewButton onClick={onApply}>Kandideeri</TTNewButton>
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
									Grupiga: <Link href={`/groups/${application.group.id}`}>{application.group.name}</Link>
								</p>
							)}
							<div className="mb-3">
								{!application.acceptedAt && !application.declinedAt && (
									<Tag text="Pending" variant={TagVariants.WARNING} />
								)}
								{application.acceptedAt && (
									<Tag
										text={`Accepted at ${formatDate(application.acceptedAt)}`}
										variant={TagVariants.SUCCESS_FILLED}
									/>
								)}
								{application.declinedAt && (
									<Tag
										text={`Declined at ${formatDate(application.declinedAt)}`}
										variant={TagVariants.DANGER_FILLED}
									/>
								)}
							</div>
						</>
					)}
				</div>
			</TTNewCardContent>
		</TTNewCard>
	);
}
