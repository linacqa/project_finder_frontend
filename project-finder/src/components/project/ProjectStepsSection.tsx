import { AccountContext } from "@/context/AccountContext";
import { IProjectStep } from "@/types/domain/IProjectStep";
import { IStepStatus } from "@/types/domain/IStepStatus";
import { useContext, useState } from "react";
import {
	ButtonGroup,
	Heading,
	Tag,
	TagVariants,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewSelect,
} from "taltech-styleguide";

interface ProjectStepsSectionProps {
	projectSteps: IProjectStep[];
	stepStatuses: IStepStatus[];
	onStatusChange: (projectStepId: string, newStatusId: string) => void;
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("et-EE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function statusVariant(statusName?: string) {
	if (statusName === "Pole alustatud") return TagVariants.DANGER;
	if (statusName === "Protsessis") return TagVariants.WARNING;
	if (statusName === "Tehtud") return TagVariants.SUCCESS;
	return TagVariants.INFO;
}

export default function ProjectStepsSection({
	projectSteps,
	stepStatuses,
	onStatusChange,
}: ProjectStepsSectionProps) {
	const [editingStepId, setEditingStepId] = useState<string | null>(null);
	const { accountInfo } = useContext(AccountContext);

	return (
		<div className="row mt-3">
			<div>
				<Heading as="h2" visual="h4" className="mb-2">
					Etapid
				</Heading>
				{projectSteps.map((projectStep) => (
					<TTNewCard key={projectStep.id} className="mb-2">
						<TTNewCardContent>
							<Heading as="h3" visual="h5" className="mb-2">
								{projectStep.step?.name || "Puudub etapi nimi"}
							</Heading>
							<div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
								<Tag
									text={
										projectStep.stepStatus?.name ||
										"Puudub staatuse nimi"
									}
									variant={statusVariant(
										projectStep.stepStatus?.name,
									)}
									as="div"
								/>
								<TTNewButton
									variant="secondary"
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 16 16"
											fill="currentColor"
											aria-hidden="true"
										>
											<path d="M12.854.146a.5.5 0 0 0-.708 0L10.5 1.793l3.707 3.707 1.647-1.646a.5.5 0 0 0 0-.708l-3-3z" />
											<path d="M10.793 2.5 2 11.293V14h2.707L13.5 5.207 10.793 2.5z" />
										</svg>
									}
									size="sm"
									onClick={() =>
										setEditingStepId(projectStep.id)
									}
								/>
							</div>
							{editingStepId === projectStep.id && (
								<div className="mt-2">
									<ButtonGroup>
										<TTNewSelect
											value={
												projectStep.stepStatus?.id || ""
											}
											onChange={(statusOption) => {
												const newStatusId =
													statusOption?.value || "";
												onStatusChange(
													projectStep.id,
													newStatusId,
												);
												setEditingStepId(null);
											}}
											options={stepStatuses.map(
												(status) => ({
													value: status.id,
													label: status.name,
												}),
											)}
										/>
										<TTNewButton
											variant="tertiary"
											size="sm"
											onClick={() =>
												setEditingStepId(null)
											}
										>
											Cancel
										</TTNewButton>
									</ButtonGroup>
								</div>
							)}
						</TTNewCardContent>
					</TTNewCard>
				))}
			</div>
		</div>
	);
}
