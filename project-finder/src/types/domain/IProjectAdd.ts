export interface IProjectAdd {
	titleInEstonian: string;
	titleInEnglish: string;
	authorId: string;
	description: string;
	client: string | null;
	primarySupervisorId: string | null;
	primarySupervisor: string | null;
	externalSupervisorId: string | null;
	externalSupervisor: string | null;
	minStudents: number;
	maxStudents: number;
	projectTypeId: string;
	projectStatusId: string;
	deadline: string | null;
	folderIds: string[];
	tagIds: string[];
	stepIds: string[];
}
