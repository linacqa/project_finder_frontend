import { IDomainId } from "@/types/IDomainId";

export interface ISupervisorInfo extends IDomainId {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	uniId: string;
}
