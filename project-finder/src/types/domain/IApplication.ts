import { IDomainId } from "../IDomainId";
import { IStudentInfo } from "../IStudentInfo";
import { IGroup } from "./IGroup";
import { IProject } from "./IProject";

export interface IApplication extends IDomainId {
	userId: string | null,
	user: IStudentInfo | null,
	groupId: string | null,
	group: IGroup | null,
	projectId: string,
	project: IProject | null,
	acceptedAt: string | null,
	declinedAt: string | null
}
