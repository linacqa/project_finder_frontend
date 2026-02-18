import { IDomainId } from "../IDomainId";
import { IUserInfo } from "../IUserInfo";
import { IUserProjectRole } from "./IUserProjectRole";

export interface IUserProject extends IDomainId {
	projectId: string;
	userId: string;
	user: IUserInfo;
	userProjectRoleId: string;
	userProjectRole: IUserProjectRole;
}
