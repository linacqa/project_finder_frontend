import { IDomainId } from "../IDomainId";
import { IUserInfo } from "../IUserInfo";

export interface IUserGroup extends IDomainId {
	groupId: string;
	userId: string;
	user: IUserInfo;
	role: string;
}
