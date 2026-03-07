import { IDomainId } from "../IDomainId";

export interface IApplication extends IDomainId {
	userId: string | null,
	groupId: string | null,
	projectId: string,
	acceptedAt: string | null,
	declinedAt: string | null
}
