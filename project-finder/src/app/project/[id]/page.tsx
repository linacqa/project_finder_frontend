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
import { Heading, TTNewContainer } from "taltech-styleguide";
import ApplicationCard from "@/components/project/ApplicationCard";
import CommentsSection from "@/components/project/CommentsSection";
import ProjectHeaderSection from "@/components/project/ProjectHeaderSection";
import ProjectMetaCard from "@/components/project/ProjectMetaCard";
import { IProjectStep } from "@/types/domain/IProjectStep";
import { ProjectStepService } from "@/services/ProjectStepService";
import ProjectStepsSection from "@/components/project/ProjectStepsSection";
import { IStepStatus } from "@/types/domain/IStepStatus";
import { StepStatusService } from "@/services/StepStatusService";

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

	const [isLoading, setIsLoading] = useState(true);

	const [isGroupApplication, setIsGroupApplication] = useState(false);
	const [groups, setGroups] = useState<IGroup[]>([]);
	const [selectedGroupId, setSelectedGroupId] = useState<{
		label: string;
		value: string;
	} | null>(null);

	const [stepStatuses, setStepStatuses] = useState<IStepStatus[]>([]);

	const { accountInfo } = useContext(AccountContext);

	const projectService = new ProjectService();
	const applicationService = new ApplicationService();
	const groupService = new GroupService();
	const projectStepService = new ProjectStepService();
	const commentService = new CommentService();
	const stepStatusService = new StepStatusService();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
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
			} catch (error) {
				console.error("Error fetching project data: ", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
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

	const updateStepStatus = async (projectStepStatusId: string, newStatusId: string) => {
		try {
			const res = await projectStepService.updateStepStatusAsync(projectStepStatusId, newStatusId);
			if (res?.statusCode && res.statusCode <= 300) {
				console.log("Step status updated successfully");
				// Refresh project steps
				const stepsRes = await projectStepService.getAllByProjectIdAsync(projectId);
				if (stepsRes?.data) setProjectSteps(stepsRes.data);
			} else {
				console.error("Failed to update step status");
			}
		} catch (error) {
			console.error("Error updating step status: ", error);
		}
	};

	const loadComments = async () => {
		const res = await commentService.getAllByProjectIdAsync(projectId);
		setComments(res?.data ?? []);
	};

	const postComment = async () => {
		if (newComment.trim() === "") {
			alert("Kommentaar ei saa olla tühi");
			return;
		}

		const res = await commentService.addAsync({
			projectId: projectId,
			content: newComment,
			replyToCommentId: null,
		});
		if (res && res.data) {
			console.log("Comment added successfully");
			await loadComments();
			setNewComment("");
		}
	};

	return (
		<>
			{isLoading ? (
				<p>Laadin...</p>
			) : (
				<>
					{project && <ProjectHeaderSection project={project} />}

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
								<ApplicationCard
									isStudent={accountInfo?.role === "student"}
									application={application}
									project={project}
									isGroupApplication={isGroupApplication}
									setIsGroupApplication={
										setIsGroupApplication
									}
									groups={groups}
									selectedGroupId={selectedGroupId}
									setSelectedGroupId={setSelectedGroupId}
									onApply={addApplication}
								/>
								<ProjectMetaCard project={project} />
							</div>
						</div>
						{/* TODO: check that user is project member */}
						<ProjectStepsSection
							projectSteps={projectSteps}
							stepStatuses={stepStatuses}
							onStatusChange={(projectStepStatusId: string, newStatusId: string) => updateStepStatus(projectStepStatusId, newStatusId)}
						/>

						{/* TODO: add option to reply to comments and show comment threads */}
						<CommentsSection
							comments={comments}
							newComment={newComment}
							setNewComment={setNewComment}
							onPostComment={postComment}
						/>
					</TTNewContainer>
				</>
			)}
		</>
	);
}
