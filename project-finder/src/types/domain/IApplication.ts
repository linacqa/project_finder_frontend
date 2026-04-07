import { IDomainId } from "../IDomainId";
import { IStudentInfo } from "../IStudentInfo";
import { IGroup } from "./IGroup";

export interface IApplication extends IDomainId {
	userId: string | null,
	user: IStudentInfo | null,
	groupId: string | null,
	group: IGroup | null,
	projectId: string,
	acceptedAt: string | null,
	declinedAt: string | null
}
