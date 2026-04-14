"use client";
import Filters from "@/components/project/Filters";
import ProjectCard from "@/components/project/ProjectCard";
import { ProjectService } from "@/services/ProjectService";
import { ProjectStatusService } from "@/services/ProjectStatusService";
import { ProjectTypeService } from "@/services/ProjectTypeService";
import { TagService } from "@/services/TagService";
import { IProject } from "@/types/domain/IProject";
import { IProjectStatus } from "@/types/domain/IProjectStatus";
import { IProjectType } from "@/types/domain/IProjectType";
import { ITag } from "@/types/domain/ITag";
import { useEffect, useState } from "react";
import { FormGroup } from "react-bootstrap";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	Input,
	TTNewAlert,
	TTNewButton,
	TTNewContainer,
} from "taltech-styleguide";

type FiltersState = {
	minStudents: string;
	maxStudents: string;
	selectedTagIds: string[];
	selectedStatusIds: string[];
	selectedProjectTypeIds: string[];
};

const initialFilters: FiltersState = {
	minStudents: "1",
	maxStudents: "10",
	selectedTagIds: [],
	selectedStatusIds: [],
	selectedProjectTypeIds: [],
};

export default function AllProjects() {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [tags, setTags] = useState<ITag[]>([]);
	const [statuses, setStatuses] = useState<IProjectStatus[]>([]);
	const [projectTypes, setProjectTypes] = useState<IProjectType[]>([]);

	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<FiltersState>(initialFilters);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [filtersOpen, setFiltersOpen] = useState(false);

	const projectService = new ProjectService();
	const tagService = new TagService();
	const projectStatusService = new ProjectStatusService();
	const projectTypeService = new ProjectTypeService();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const extractProjects = (data: unknown): IProject[] => {
		if (Array.isArray(data)) {
			return data as IProject[];
		}

		if (data && typeof data === "object") {
			const objectData = data as Record<string, unknown>;
			const collectionKeys = ["items", "results", "projects", "data"];

			for (const key of collectionKeys) {
				const value = objectData[key];
				if (Array.isArray(value)) {
					return value as IProject[];
				}
			}
		}

		return [];
	};

	const onFilterChange = (updatedStudentFilters: {
		minStudents: string;
		maxStudents: string;
		statusIds: string[];
		tagIds: string[];
		projectTypeIds: string[];
	}) => {
		const mergedFilters: FiltersState = {
			...filters,
			minStudents: updatedStudentFilters.minStudents,
			maxStudents: updatedStudentFilters.maxStudents,
			selectedStatusIds: updatedStudentFilters.statusIds,
			selectedTagIds: updatedStudentFilters.tagIds,
			selectedProjectTypeIds: updatedStudentFilters.projectTypeIds,
		};
		setFilters(mergedFilters);
		void loadProjects(mergedFilters);
	};

	const loadProjects = async (activeFilters?: FiltersState) => {
		setMessage({ type: "loading", text: "Laadin projekte..." });

		const filtersToUse = activeFilters ?? filters;

		const res = await projectService.searchAsync({
			title: search.trim() || undefined,
			minStudents:
				filtersToUse.minStudents !== ""
					? Number(filtersToUse.minStudents)
					: undefined,
			maxStudents:
				filtersToUse.maxStudents !== ""
					? Number(filtersToUse.maxStudents)
					: undefined,
			tagIds:
				filtersToUse.selectedTagIds.length > 0
					? filtersToUse.selectedTagIds
					: undefined,
			statusIds:
				filtersToUse.selectedStatusIds.length > 0
					? filtersToUse.selectedStatusIds
					: undefined,
			projectTypeIds:
				filtersToUse.selectedProjectTypeIds.length > 0
					? filtersToUse.selectedProjectTypeIds
					: undefined,
			page,
			pageSize,
		});

		if (res.data) {
			const projectList = extractProjects(res.data);
			setProjects(projectList);
			setMessage(null);
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	useEffect(() => {
		void loadProjects();
	}, []);

	useEffect(() => {
		tagService.getAllAsync().then((res) => {
			if (res.data) {
				setTags(res.data);
			}
		});

		projectStatusService.getAllAsync().then((res) => {
			if (res.data) {
				setStatuses(res.data);
			}
		});

		projectTypeService.getAllAsync().then((res) => {
			if (res.data) {
				setProjectTypes(res.data);
			}
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

			<Filters
				isOpen={filtersOpen}
				onClose={() => setFiltersOpen(false)}
				onFilterChange={onFilterChange}
				statusOptions={statuses}
				tagOptions={tags}
				projectTypeOptions={projectTypes}
			/>

			<div className="d-flex flex-row gap-2">
				<TTNewButton
					className="mx-2 h5 w-10 h-50 filter-button"
					onClick={() => setFiltersOpen(true)}
				>
					Ava filtrid
				</TTNewButton>
				<FormGroup className="mb-4 w-100">
					<Input
						type="search"
						placeholder="Otsi teemasid..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						// todo: reload projects
					/>
				</FormGroup>
			</div>

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
