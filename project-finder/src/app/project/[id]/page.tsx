"use client";
import { AccountContext } from "@/context/AccountContext";
import { ApplicationService } from "@/services/ApplicationService";
import { CommentService } from "@/services/CommentService";
import { GroupService } from "@/services/GroupService";
import { ProjectService } from "@/services/ProjectService";
import { IApplication } from "@/types/domain/IApplication";
import { IComment } from "@/types/domain/IComment";
import { IGroup } from "@/types/domain/IGroup";
import { IProject } from "@/types/domain/IProject";
import Link from "next/link";
import { use, useContext, useEffect, useState } from "react";
import {
	CustomInput,
	Heading,
	Input,
	Separator,
	STATUS_TYPE,
	StatusTag,
	Tag,
	TagVariants,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
	TTNewSelect,
} from "taltech-styleguide";

export default function ProjectDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const projectId = use(params).id;
	const [project, setProject] = useState<IProject | null>(null);
	const [application, setApplication] = useState<IApplication | null>(null);
	const [comments, setComments] = useState<IComment[]>([]);
	const [newComment, setNewComment] = useState("");

	const [isGroupApplication, setIsGroupApplication] = useState(false);
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [selectedGroupId, setSelectedGroupId] = useState<{
		label: string;
		value: string;
	} | null>(null);

	const { accountInfo, setAccountInfo } = useContext(AccountContext);

	const projectService = new ProjectService();
	const applicationService = new ApplicationService();
	const groupService = new GroupService();
	const commentService = new CommentService();

	useEffect(() => {
		projectService.getByIdAsync(projectId).then((res) => {
			if (res && res.data) {
				setProject(res.data);
			}
		});

		applicationService
			.getCurrentUsersApplicationByProjectIdAsync(projectId)
			.then((res) => {
				if (res && res.data) {
					setApplication(res.data);
				}
			});

		groupService
			.getAllMatchingProjectTeamSizeAsync(projectId)
			.then((res) => {
				if (res && res.data) {
					setGroups(res.data);
				}
			});

		commentService.getAllByProjectIdAsync(projectId).then((res) => {
			if (res && res.data) {
				setComments(res.data);
			}
		});
	}, [projectId]);

	const addApplication = () => {
		if (isGroupApplication && !selectedGroupId) {
			alert("Palun valige grupp, millega kandideerite");
			return;
		}
		console.log(selectedGroupId);
		const applicationService = new ApplicationService();
		try {
			applicationService
				.addAsync({
					projectId: projectId,
					groupId: isGroupApplication
						? (selectedGroupId?.value ?? null)
						: null,
				})
				.then((res) => {
					if (res && res.data) {
						console.log("Application added successfully");
					}
				});
		} catch (err) {
			console.log("Something went wrong when applying for the project");
		}
	};

	const postComment = () => {
		if (newComment.trim() === "") {
			alert("Kommentaar ei saa olla tühi");
			return;
		}

		commentService
			.addAsync({
				projectId: projectId,
				content: newComment,
				replyToCommentId: null,
			})
			.then((res) => {
				if (res && res.data) {
					console.log("Comment added successfully");
					setNewComment("");
				}
			});
	};

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
				{project?.client && project.client !== "" && (
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
						<p style={{ whiteSpace: "pre-wrap" }}>
							{project?.description}
						</p>
					</div>

					<div className="col-md-4">
						{accountInfo?.role === "student" && (
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
													onChange={(e) =>
														setIsGroupApplication(
															e.target.checked,
														)
													}
												/>
												{isGroupApplication &&
													project?.maxStudents &&
													project?.maxStudents >=
														2 && (
														<TTNewSelect
															className="mb-3"
															options={groups.map(
																(g) => ({
																	value: g.id,
																	label: g.name,
																}),
															)}
															placeholder="Vali grupp"
															value={
																selectedGroupId
															}
															onChange={(value) =>
																setSelectedGroupId(
																	value,
																)
															}
														/>
													)}
												{project?.minStudents === 1 && (
													<TTNewButton
														onClick={addApplication}
													>
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
															{
																application
																	.group.name
															}
														</Link>
													</p>
												)}
												<div className="mb-3">
													{!application.acceptedAt &&
														!application.declinedAt && (
															<Tag
																text={"Pending"}
																variant={
																	TagVariants.WARNING
																}
															/>
														)}
													{application.acceptedAt && (
														<Tag
															text={`Accepted at ${new Date(
																application.acceptedAt,
															).toLocaleDateString(
																"et-EE",
																{
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																},
															)}`}
															variant={
																TagVariants.SUCCESS_FILLED
															}
														/>
													)}
													{application.declinedAt && (
														<Tag
															text={`Declined at ${new Date(
																application.declinedAt,
															).toLocaleDateString(
																"et-EE",
																{
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																},
															)}`}
															variant={
																TagVariants.DANGER_FILLED
															}
														/>
													)}
												</div>
												{/* <TTNewButton
													iconRight="delete"
													variant="danger"
													hidden
												>
													Kustuta
												</TTNewButton> */}
											</>
										)}
									</div>
								</TTNewCardContent>
							</TTNewCard>
						)}
						<TTNewCard>
							<TTNewCardContent>
								<div className="d-flex flex-column gap-3">
									<div>
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
												{((!project?.users?.some(
													(u) =>
														u.userProjectRole
															.name ===
														"Supervisor",
												) &&
													project?.supervisor ===
														null) ||
													project?.supervisor ===
														"") && (
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
												{((!project?.users?.some(
													(u) =>
														u.userProjectRole
															.name ===
														"Supervisor",
												) &&
													project?.supervisor ===
														null) ||
													project?.supervisor ===
														"") && (
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
															{u.user.firstName}{" "}
															{u.user.lastName} (
															{u.user.email})
														</div>
													))}
												{project?.supervisor && (
													<div>
														{/* <Heading
															as="h3"
															visual="h6"
															className="mb-2"
														>
															Peamine juhendaja
														</Heading> */}
														{project.supervisor}
													</div>
												)}
											</div>

											{((!project?.users?.some(
												(u) =>
													u.userProjectRole.name ===
													"External Supervisor",
											) &&
												project?.externalSupervisor ===
													null) ||
												project?.externalSupervisor ===
													"") && (
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
														{u.user.firstName}{" "}
														{u.user.lastName} (
														{u.user.email})
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

										{project?.deadline && (
											<div className="d-flex mb-2">
												<p className="me-2 text-bold mb-2">
													Tähtaeg:
												</p>
												<p className="text-secondary-dark text-bold mb-0">
													{new Date(
														project.deadline,
													).toLocaleDateString(
														"et-EE",
														{
															year: "numeric",
															month: "2-digit",
															day: "2-digit",
														},
													)}
												</p>
											</div>
										)}
										<div className="d-flex">
											<p className="me-2 text-bold mb-0">
												Loodud:
											</p>
											<p className="text-secondary-dark text-bold mb-0">
												{project?.createdAt &&
													new Date(
														project.createdAt,
													).toLocaleDateString(
														"et-EE",
														{
															year: "numeric",
															month: "2-digit",
															day: "2-digit",
														},
													)}
											</p>
										</div>
									</div>
								</div>
							</TTNewCardContent>
						</TTNewCard>
					</div>
				</div>

				{/* TODO: check that user is project member */}
				{/* TODO: add option to reply to comments and show comment threads */}
				<div className="row mt-3">
					<div>
						<Heading as="h2" visual="h4" className="mb-2">
							Kommentaarid
						</Heading>
						{comments.map((comment) => (
							<TTNewCard key={comment.id} className="mb-2">
								<TTNewCardContent>
									<p>{comment.content}</p>
									<small className="text-muted">
										{comment.user.firstName}{" "}
										{comment.user.lastName} (
										{comment.user.email})
									</small>
									<br />
									<small className="text-muted">
										{new Date(
											comment.createdAt,
										).toLocaleDateString("et-EE", {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</small>
								</TTNewCardContent>
							</TTNewCard>
						))}
						<TTNewCard>
							<TTNewCardContent>
								<div className="d-flex flex-column gap-2">
									<Input
										as="textarea"
										placeholder="Lisa kommentaar"
										value={newComment}
										onChange={(e) =>
											setNewComment(e.target.value)
										}
									/>
									<TTNewButton onClick={postComment}>
										Postita
									</TTNewButton>
								</div>
							</TTNewCardContent>
						</TTNewCard>
					</div>
				</div>
			</TTNewContainer>
		</>
	);
}
