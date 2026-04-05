import { IDomainId } from "../IDomainId";
import { IStudentInfo } from "../IStudentInfo";
import { IGroup } from "./IGroup";

export interface IInvitation extends IDomainId {
	groupId: string;
	group: IGroup;
	fromUserId: string;
	fromUser: IStudentInfo;
	toUserId: string;
	toUser: IStudentInfo;
	role: string;
	acceptedAt: string | null;
	declinedAt: string | null;
}
