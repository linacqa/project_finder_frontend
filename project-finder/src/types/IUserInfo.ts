import { IDomainId } from "@/types/IDomainId";

export interface IUserInfo extends IDomainId {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
}
