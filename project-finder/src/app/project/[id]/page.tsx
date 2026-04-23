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
import { use, useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	Heading,
	TTNewAlert,
	TTNewContainer,
} from "taltech-styleguide";
import ApplicationCard from "@/components/project/ApplicationCard";
import CommentsSection from "@/components/project/CommentsSection";
import ProjectHeaderSection from "@/components/project/ProjectHeaderSection";
import ProjectMetaCard from "@/components/project/ProjectMetaCard";
import { IProjectStep } from "@/types/domain/IProjectStep";
import { ProjectStepService } from "@/services/ProjectStepService";
import ProjectStepsSection from "@/components/project/ProjectStepsSection";
import { IStepStatus } from "@/types/domain/IStepStatus";
import { StepStatusService } from "@/services/StepStatusService";
import { set } from "react-hook-form";
import { useRouter } from "next/dist/client/components/navigation";

export default function ProjectDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const projectId = use(params).id;
	const [project, setProject] = useState<IProject | null>(null);
	const [application, setApplication] = useState<IApplication | null>(null);
	const [projectSteps, setProjectSteps] = useState<IProjectStep[]>([]);

	const [comments, setComments] = useState<IComment[]>([]);
	const [newComment, setNewComment] = useState("");

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const [isGroupApplication, setIsGroupApplication] = useState(false);
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [selectedGroupId, setSelectedGroupId] = useState<{
		label: string;
		value: string;
	} | null>(null);

	const [stepStatuses, setStepStatuses] = useState<IStepStatus[]>([]);

	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const projectService = new ProjectService();
	const applicationService = new ApplicationService();
	const groupService = new GroupService();
	const projectStepService = new ProjectStepService();
	const commentService = new CommentService();
	const stepStatusService = new StepStatusService();

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.jwt) {
			router.push("/login");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		const fetchData = async () => {
			setMessage({ type: "loading", text: "Laadin projekti andmeid..." });
			try {
				const [
					projectRes,
					applicationRes,
					groupsRes,
					commentsRes,
					projectStepsRes,
					stepStatusesRes,
				] = await Promise.all([
					projectService.getByIdAsync(projectId),
					applicationService.getCurrentUsersApplicationByProjectIdAsync(
						projectId,
					),
					groupService.getAllMatchingProjectTeamSizeAsync(projectId),
					commentService.getAllByProjectIdAsync(projectId),
					projectStepService.getAllByProjectIdAsync(projectId),
					stepStatusService.getAllAsync(),
				]);

				if (projectRes?.data) setProject(projectRes.data);
				if (applicationRes?.data) setApplication(applicationRes.data);
				if (groupsRes?.data) setGroups(groupsRes.data);
				if (commentsRes?.data) setComments(commentsRes.data);
				if (projectStepsRes?.data)
					setProjectSteps(projectStepsRes.data);
				if (stepStatusesRes?.data)
					setStepStatuses(stepStatusesRes.data);

				if (
					projectRes?.data &&
					commentsRes?.data &&
					projectStepsRes?.data &&
					stepStatusesRes?.data
				) {
					setMessage(null);
				} else {
					const errors: string[] = [];
					if (!projectRes?.data)
						errors.push(
							`Projekti laadimine: ${projectRes?.errors}`,
						);
					if (!commentsRes?.data && !(commentsRes.statusCode == 401))
						errors.push(
							`Kommentaaride laadimine: ${commentsRes?.errors}`,
						);
					if (
						!projectStepsRes?.data &&
						!(projectStepsRes.statusCode == 401)
					)
						errors.push(
							`Etappide laadimine: ${projectStepsRes?.errors}`,
						);
					if (
						!stepStatusesRes?.data &&
						!(stepStatusesRes.statusCode == 401)
					)
						errors.push(
							`Staatuste laadimine: ${stepStatusesRes?.errors}`,
						);

					if (errors.length === 0) {
						setMessage(null);
						return;
					}

					setMessage({
						type: "error",
						text: errors.join(" | "),
					});
				}
			} catch (error) {
				setMessage({
					type: "error",
					text: "Projekti andmete laadimine ebaõnnestus.",
				});
			}
		};
		fetchData();
	}, [projectId]);

	const addApplication = () => {
		if (isGroupApplication && !selectedGroupId) {
			setMessage({
				type: "error",
				text: "Palun valige grupp, millega kandideerite.",
			});
			return;
		}
		setMessage({ type: "loading", text: "Saadan kandidatuuri..." });
		try {
			applicationService
				.addAsync({
					projectId: projectId,
					groupId: isGroupApplication
						? (selectedGroupId?.value ?? null)
						: null,
				})
				.then((res) => {
					if (
						res &&
						res.statusCode &&
						res.statusCode <= 300 &&
						res.data
					) {
						setMessage({
							type: "success",
							text: "Kandidatuur saadetud.",
						});
						applicationService
							.getCurrentUsersApplicationByProjectIdAsync(
								projectId,
							)
							.then((applicationRes) => {
								if (applicationRes?.data) {
									setApplication(applicationRes.data);
								}
							});
						return;
					}

					setMessage({
						type: "error",
						text: `${res.statusCode ?? "Error"} - ${res.errors}`,
					});
				});
		} catch (err) {
			setMessage({
				type: "error",
				text: "Kandidatuuri saatmine ebaõnnestus.",
			});
		}
	};

	const deleteApplication = (applicationId: string) => {
		setMessage({ type: "loading", text: "Kustutan kandideerimist..." });
		try {
			applicationService.deleteByIdAsync(applicationId).then((res) => {
				if (res && res.statusCode && res.statusCode <= 300) {
					setApplication(null);
					setMessage({
						type: "success",
						text: "Kandideerimine kustutatud.",
					});
					return;
				}

				setMessage({
					type: "error",
					text: `${res.statusCode ?? "Error"} - ${res.errors}`,
				});
			});
		} catch (err) {
			setMessage({
				type: "error",
				text: "Kandideerimise kustutamine ebaõnnestus.",
			});
		}
	};

	const deleteComment = (commentId: string) => {
		setMessage({ type: "loading", text: "Kustutan kommentaari..." });
		try {
			commentService.deleteByIdAsync(commentId).then((res) => {
				if (res && res.statusCode && res.statusCode <= 300) {
					commentService
						.getAllByProjectIdAsync(projectId)
						.then((commentsRes) => {
							if (commentsRes?.data) {
								setComments(commentsRes.data);
							}
						});
					setMessage({
						type: "success",
						text: "Kommentaar kustutatud.",
					});
					return;
				}

				setMessage({
					type: "error",
					text: `${res.statusCode ?? "Error"} - ${res.errors}`,
				});
			});
		} catch (err) {
			setMessage({
				type: "error",
				text: "Kommentaari kustutamine ebaõnnestus.",
			});
		}
	};

	const updateStepStatus = async (
		projectStepStatusId: string,
		newStatusId: string,
	) => {
		setMessage({ type: "loading", text: "Uuendan etapi staatust..." });
		try {
			const res = await projectStepService.updateStepStatusAsync(
				projectStepStatusId,
				newStatusId,
			);
			if (res?.statusCode && res.statusCode <= 300) {
				// Refresh project steps
				const stepsRes =
					await projectStepService.getAllByProjectIdAsync(projectId);
				if (stepsRes?.data) {
					setProjectSteps(stepsRes.data);
					setMessage({
						type: "success",
						text: "Etapi staatus uuendatud.",
					});
					return;
				}
			}

			setMessage({
				type: "error",
				text: `${res?.statusCode ?? "Error"} - ${res?.errors}`,
			});
		} catch (error) {
			console.error("Error updating step status: ", error);
			setMessage({
				type: "error",
				text: "Etapi staatuse uuendamine ebaõnnestus.",
			});
		}
	};

	const loadComments = async () => {
		const res = await commentService.getAllByProjectIdAsync(projectId);
		setComments(res?.data ?? []);
	};

	const postComment = async () => {
		if (newComment.trim() === "") {
			setMessage({
				type: "error",
				text: "Kommentaar ei saa olla tühi.",
			});
			return;
		}

		setMessage({ type: "loading", text: "Postitan kommentaari..." });
		const res = await commentService.addAsync({
			projectId: projectId,
			content: newComment,
			replyToCommentId: null,
		});
		if (res && res.statusCode && res.statusCode <= 300 && res.data) {
			await loadComments();
			setNewComment("");
			setMessage({ type: "success", text: "Kommentaar postitatud." });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	const postReply = async (replyToCommentId: string, content: string) => {
		if (content.trim() === "") {
			setMessage({
				type: "error",
				text: "Vastus ei saa olla tühi.",
			});
			return;
		}

		setMessage({ type: "loading", text: "Postitan vastust..." });
		const res = await commentService.addAsync({
			projectId: projectId,
			content,
			replyToCommentId,
		});

		if (res && res.statusCode && res.statusCode <= 300 && res.data) {
			await loadComments();
			setMessage({ type: "success", text: "Vastus postitatud." });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	return (
		<>
			{message && (
				<div>
					<TTNewAlert
						position={ALERT_POSITION_TYPES.INLINE}
						variant={
							message.type === "error"
								? ALERT_STATUS_TYPE.ERROR
								: message.type === "success"
									? ALERT_STATUS_TYPE.SUCCESS
									: ALERT_STATUS_TYPE.INFO
						}
						dismissible
						size={ALERT_SIZE.SMALL}
						title={message.text}
						onClose={() => setMessage(null)}
					></TTNewAlert>
				</div>
			)}
			{project && <ProjectHeaderSection project={project} />}

			<TTNewContainer>
				<div className="row">
					<div className="col-md-8">
						<Heading as="h2" visual="h4" className="mb-2">
							Kirjeldus
						</Heading>
						<p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word", hyphens: "auto" }}>
							{project?.description}
						</p>
					</div>

					<div className="col-md-4">
						<ApplicationCard
							isStudent={accountInfo?.role === "student"}
							application={application}
							project={project}
							isGroupApplication={isGroupApplication}
							setIsGroupApplication={setIsGroupApplication}
							groups={groups}
							selectedGroupId={selectedGroupId}
							setSelectedGroupId={setSelectedGroupId}
							onApply={addApplication}
							onDelete={deleteApplication}
						/>
						<ProjectMetaCard project={project} />
					</div>
				</div>

				{project?.users &&
					accountInfo &&
					(accountInfo.role === "admin" ||
						project.users.some(
							(u) => u.user.id === accountInfo.userId,
						)) && (
						<>
							<ProjectStepsSection
								projectSteps={projectSteps}
								stepStatuses={stepStatuses}
								onStatusChange={(
									projectStepStatusId: string,
									newStatusId: string,
								) =>
									updateStepStatus(
										projectStepStatusId,
										newStatusId,
									)
								}
							/>

							<CommentsSection
								comments={comments}
								newComment={newComment}
								setNewComment={setNewComment}
								onPostComment={postComment}
								onPostReply={postReply}
								onDelete={deleteComment}
							/>
						</>
					)}
			</TTNewContainer>
		</>
	);
}
