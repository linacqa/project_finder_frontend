import { IDomainId } from "@/types/IDomainId";

export interface IUserInfo extends IDomainId {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string | null;
	role: string;
	uniId: string | null;
	matriculationNumber: string | null;
	program: string | null;
}
