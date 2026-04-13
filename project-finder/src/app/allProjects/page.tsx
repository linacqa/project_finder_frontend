"use client";
import ProjectCard from "@/components/project/ProjectCard";
import { ProjectService } from "@/services/ProjectService";
import { IProject } from "@/types/domain/IProject";
import { useEffect, useState } from "react";
import { ALERT_POSITION_TYPES, ALERT_SIZE, ALERT_STATUS_TYPE, TTNewAlert, TTNewContainer } from "taltech-styleguide";

export default function AllProjects() {
	const [projects, setProjects] = useState<IProject[]>([]);

	const projectService = new ProjectService();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	useEffect(() => {
		setMessage({ type: "loading", text: "Laadin projekte..." });
		projectService.getAllAsync().then((res) => {
			if (res.data) {
				setProjects(res.data);
				setMessage(null);
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	}, []);

	return (
		<TTNewContainer>
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

			<h1>All Projects</h1>

			<div className="thesis-list-container">
				{projects.map((project) => (
					<ProjectCard
						key={project.id}
						id={project.id}
						titleInEstonian={project.titleInEstonian}
						titleInEnglish={project.titleInEnglish}
						author={project.users
							.filter(
								(userProject) =>
									userProject.userProjectRole.name ===
									"Author",
							)
							.map(
								(userProject) =>
									userProject.user.firstName +
									" " +
									userProject.user.lastName,
							)
							.join(", ")}
						tags={project.tags}
						status={project.projectStatus.name}
						supervisorMissing={
							!project.supervisor &&
							!project.users.some(
								(userProject) =>
									userProject.userProjectRole.name ===
									"Supervisor",
							)
						}
						teamSizeMin={project.minStudents}
						teamSizeMax={project.maxStudents}
						deadline={project.deadline}
						createdAt={project.createdAt}
					/>
				))}
			</div>
		</TTNewContainer>
	);
}
