"use client";
import ProjectCard from "@/components/project/ProjectCard";
import { ProjectService } from "@/services/ProjectService";
import { IProject } from "@/types/domain/IProject";
import { useEffect, useState } from "react";
import { TTNewContainer } from "taltech-styleguide";

export default function AllProjects() {
	const [projects, setProjects] = useState<IProject[]>([]);

	useEffect(() => {
		const projectService = new ProjectService();
		projectService.getAllAsync().then((res) => {
			setProjects(res.data as IProject[]);
		});
	}, []);

	return (
		<TTNewContainer>
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
