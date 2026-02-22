import { IDomainId } from "../IDomainId";
import { IProjectStatus } from "./IProjectStatus";
import { IProjectType } from "./IProjectType";
import { ITag } from "./ITag";
import { IUserProject } from "./IUserProject";

export interface IProject extends IDomainId {
	titleInEstonian: string;
	titleInEnglish: string;
	description: string;
	client: string;
	tags: ITag[];
	deadline: string;
	minStudents: number;
	maxStudents: number;
	supervisor: string;
	externalSupervisor: string;
	users: IUserProject[];
	projectStatusId: string;
	projectStatus: IProjectStatus;
	projectTypeId: string;
	projectType: IProjectType;
	createdAt: string;
}
