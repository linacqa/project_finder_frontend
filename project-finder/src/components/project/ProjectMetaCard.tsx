import { IProject } from "@/types/domain/IProject";
import Link from "next/dist/client/link";
import { Heading, Tag, TagVariants, TTNewCard, TTNewCardContent } from "taltech-styleguide";

interface ProjectMetaCardProps {
	project: IProject | null;
}

function statusVariant(statusName?: string) {
	if (statusName === "Avatud") return TagVariants.SUCCESS;
	if (statusName === "Mustand") return TagVariants.WARNING;
	if (statusName === "Arhiveeritud" || statusName === "Tehtud") return TagVariants.INFO;
	if (statusName === "Suletud") return TagVariants.DANGER;
	return TagVariants.PRIMARY;
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("et-EE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export default function ProjectMetaCard({ project }: ProjectMetaCardProps) {
	return (
		<TTNewCard>
			<TTNewCardContent>
				<div className="d-flex flex-column gap-3">
					<div>
						{project?.projectStatus && (
							<div className="mb-3 d-flex flex-wrap gap-1">
								<Tag
									text={project.projectStatus.name}
									variant={statusVariant(project.projectStatus.name)}
									as="div"
								/>
								{((!project?.users?.some(
									(u) => u.userProjectRole.name === "Supervisor",
								) && project?.supervisor === null) ||
									project?.supervisor === "") && (
									<Tag
										text="Juhendaja puudub"
										variant={TagVariants.DANGER}
										as="div"
									/>
								)}
							</div>
						)}
						<div className="d-flex flex-column gap-2">
							<div>
								<Heading as="h3" visual="h6" className="mb-2">
									Peamine juhendaja
								</Heading>
								{((!project?.users?.some(
									(u) => u.userProjectRole.name === "Supervisor",
								) && project?.supervisor === null) ||
									project?.supervisor === "") && (
									<div className="text-muted">Puudub</div>
								)}
								{project?.users
									?.filter((u) => u.userProjectRole.name === "Supervisor")
									.map((u, index) => (
										<div key={index}>
											<Link href={`/profile/${u.user.id}`}>{u.user.firstName} {u.user.lastName}</Link> ({u.user.email})
										</div>
									))}
								{project?.supervisor && <div>{project.supervisor}</div>}
							</div>

							<div>
								<Heading as="h3" visual="h6" className="mb-2">
									Kaasjuhendaja
								</Heading>
								{((!project?.users?.some(
									(u) => u.userProjectRole.name === "External Supervisor",
								) && project?.externalSupervisor === null) ||
									project?.externalSupervisor === "") && (
									<div className="text-muted">Puudub</div>
								)}
								{project?.users
									?.filter((u) => u.userProjectRole.name === "External Supervisor")
									.map((u, index) => (
										<div key={index}>
											<Link href={`/profile/${u.user.id}`}>{u.user.firstName} {u.user.lastName}</Link> ({u.user.email})
										</div>
									))}
								{project?.externalSupervisor && <div>{project.externalSupervisor}</div>}
							</div>
						</div>
					</div>
					<div>
						<div className="d-flex">
							<p className="me-2 text-bold mb-2">Projekti tüüp:</p>
							<p className="text-secondary-dark text-bold mb-2">
								{project?.projectType.name}
							</p>
						</div>
						<div className="d-flex">
							<p className="me-2 text-bold mb-2">Tiimi suurus:</p>
							<p className="text-secondary-dark text-bold mb-2">
								{project?.minStudents === project?.maxStudents
									? project?.minStudents
									: `${project?.minStudents} - ${project?.maxStudents}`}
							</p>
						</div>

						{project?.deadline && (
							<div className="d-flex mb-2">
								<p className="me-2 text-bold mb-2">Tähtaeg:</p>
								<p className="text-secondary-dark text-bold mb-0">
									{formatDate(project.deadline)}
								</p>
							</div>
						)}
						<div className="d-flex">
							<p className="me-2 text-bold mb-0">Loodud:</p>
							<p className="text-secondary-dark text-bold mb-0">
								{project?.createdAt && formatDate(project.createdAt)}
							</p>
						</div>
					</div>
				</div>
			</TTNewCardContent>
		</TTNewCard>
	);
}
