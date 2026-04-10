import { IDomainId } from "../IDomainId";
import { IUserInfo } from "../IUserInfo";
import { IProject } from "./IProject";

export interface IComment extends IDomainId {
	userId: string,
	user: IUserInfo,
	projectId: string,
	project: IProject | null,
	content: string,
	replyToCommentId: string | null,
	createdAt: string,
}
