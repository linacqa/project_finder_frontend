"use client";
import { ProjectService } from "@/services/ProjectService";
import { IProject } from "@/types/domain/IProject";
import { use, useEffect, useState } from "react";
import {
	Heading,
	Separator,
	STATUS_TYPE,
	StatusTag,
	Tag,
	TagVariants,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";

export default function ProjectDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const projectId = use(params).id;
	const [project, setProject] = useState<IProject | null>(null);

	useEffect(() => {
		const projectService = new ProjectService();
		projectService.getByIdAsync(projectId).then((res) => {
			if (res && res.data) {
				setProject(res.data);
			}
		});
	}, [projectId]);

	return (
		<>
			<TTNewContainer className="py-3">
				<Heading as="h1" visual="h1" className="mb-2">
					{project?.titleInEstonian}
				</Heading>
				<Heading as="h2" visual="h3" className="mb-2">
					{project?.titleInEnglish}
				</Heading>
				<Heading as="h2" visual="h6" className="mb-2">
					Autor:{" "}
					{
						project?.users?.find(
							(u) => u.userProjectRole.name === "Author",
						)?.user.firstName
					}{" "}
					{
						project?.users?.find(
							(u) => u.userProjectRole.name === "Author",
						)?.user.lastName
					}
				</Heading>
				{project?.client !== "" && (
					<Heading as="h2" visual="h6" className="mb-3">
						Klient: {project?.client}
					</Heading>
				)}
				<div className="d-flex gap-2 flex-wrap">
					{project?.tags?.map((tag, index) => (
						// <StatusTag
						// 	key={index}
						// 	type={STATUS_TYPE.INFO}
						// >
						// 	{tag.name}
						// </StatusTag>
						<Tag
							key={index}
							text={tag.name}
							variant={TagVariants.PRIMARY}
							as="div"
						/>
					))}
				</div>
				<Separator />
			</TTNewContainer>

			<TTNewContainer>
				<div className="row">
					<div className="col-md-8">
						<Heading as="h2" visual="h4" className="mb-2">
							Kirjeldus
						</Heading>
						<p>{project?.description}</p>
					</div>

					<div className="col-md-4">
						<TTNewCard>
							<TTNewCardContent>
								<div className="d-flex flex-column gap-3">
									{/* <div>
										<Heading
											as="h2"
											visual="h4"
											className="mb-2"
										>
											Sildid
										</Heading>
										<div className="d-flex gap-2 flex-wrap">
											{project?.tags?.map(
												(tag, index) => (
													// <StatusTag
													// 	key={index}
													// 	type={STATUS_TYPE.INFO}
													// >
													// 	{tag.name}
													// </StatusTag>
													<Tag
														key={index}
														text={tag.name}
														variant={
															TagVariants.PRIMARY
														}
														as="div"
													/>
												),
											)}
										</div>
									</div> */}
									<div>
										{/* <Heading
											as="h2"
											visual="h4"
											className="mb-2"
										>
											Juhendajad
										</Heading> */}
										{project?.projectStatus && (
											<div className="mb-3 d-flex flex-wrap gap-1">
												<Tag
													text={
														project.projectStatus
															.name
													}
													variant={
														project.projectStatus
															.name === "Open"
															? TagVariants.SUCCESS
															: project
																		.projectStatus
																		.name ===
																  "Draft"
																? TagVariants.WARNING
																: project
																			.projectStatus
																			.name ===
																			"Archived" ||
																	  project
																			.projectStatus
																			.name ===
																			"Completed"
																	? TagVariants.INFO
																	: project
																				.projectStatus
																				.name ===
																		  "Closed"
																		? TagVariants.DANGER
																		: TagVariants.PRIMARY
													}
													as="div"
												/>
												{(!project?.users?.some(
														(u) =>
															u.userProjectRole
																.name ===
															"Supervisor",
													)
													&&
													project?.supervisor === null || project?.supervisor === ""
												) && (
													<Tag
														text="Juhendaja puudub"
														variant={
															TagVariants.DANGER
														}
														as="div"
													/>
												)}
											</div>
										)}
										<div className="d-flex flex-column gap-2">
											<div>
												<Heading
													as="h3"
													visual="h6"
													className="mb-2"
												>
													Peamine juhendaja
												</Heading>
												{(!project?.users?.some(
														(u) =>
															u.userProjectRole
																.name ===
															"Supervisor",
													)
													&&
													project?.supervisor === null || project?.supervisor === ""
												) && (
													<div className="text-muted">
														Puudub
													</div>
												)}
												{project?.users
													?.filter(
														(u) =>
															u.userProjectRole
																.name ===
															"Supervisor",
													)
													.map((u, index) => (
														<div key={index}>
															{u.user.firstName} {u.user.lastName} ({u.user.email})
														</div>
													))}
												{project?.supervisor && (
													<div>
														<Heading
															as="h3"
															visual="h6"
															className="mb-2"
														>
															Peamine juhendaja
														</Heading>
														{project.supervisor}
													</div>
												)}
											</div>

											{(!project?.users?.some(
														(u) =>
															u.userProjectRole
																.name ===
															"External Supervisor",
													)
													&&
													project?.externalSupervisor === null || project?.externalSupervisor === ""
												) && (
													<div className="text-muted">
														Puudub
													</div>
												)}
											{project?.users
												?.filter(
													(u) =>
														u.userProjectRole
															.name ===
														"External Supervisor",
												)
												.map((u, index) => (
													<div key={index}>
														{u.user.firstName} {u.user.lastName} ({u.user.email})
													</div>
												))}

											{project?.externalSupervisor && (
												<div>
													<Heading
														as="h3"
														visual="h6"
														className="mb-2"
													>
														Kaasjuhendaja
													</Heading>
													{project.externalSupervisor}
												</div>
											)}
										</div>
									</div>
									<div>
										<div className="d-flex">
											<p className="me-2 text-bold mb-2">
												Projekti tüüp:
											</p>
											<p className="text-secondary-dark text-bold mb-2">
												{project?.projectType.name}
											</p>
										</div>
										<div className="d-flex">
											<p className="me-2 text-bold mb-2">
												Tiimi suurus:
											</p>
											<p className="text-secondary-dark text-bold mb-2">
												{project?.minStudents ===
												project?.maxStudents
													? project?.minStudents
													: `${project?.minStudents} - ${project?.maxStudents}`}
											</p>
										</div>
										<div className="d-flex mb-2">
											<p className="me-2 text-bold mb-2">
												Tähtaeg:
											</p>
											<p className="text-secondary-dark text-bold mb-0">
												{project?.deadline &&
													new Date(
														project.deadline,
													).toLocaleDateString()}
											</p>
										</div>
										<div className="d-flex">
											<p className="me-2 text-bold mb-0">
												Loodud:
											</p>
											<p className="text-secondary-dark text-bold mb-0">
												{project?.createdAt &&
													new Date(
														project.createdAt,
													).toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
							</TTNewCardContent>
						</TTNewCard>
					</div>
				</div>
			</TTNewContainer>
		</>
	);
}
