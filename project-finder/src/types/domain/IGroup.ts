import { IDomainId } from "../IDomainId";
import { IUserInfo } from "../IUserInfo";
import { IUserGroup } from "./IUserGroup";

export interface IGroup extends IDomainId {
	name: string;
	isAzureAdGroup: boolean;
	creatorId: string;
	creator: IUserInfo;
	users: IUserGroup[];
}
