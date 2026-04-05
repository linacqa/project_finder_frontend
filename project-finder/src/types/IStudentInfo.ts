import { IDomainId } from "@/types/IDomainId";

export interface IStudentInfo extends IDomainId {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string | null;
	uniId: string | null;
	matriculationNumber: string | null;
	program: string | null;
}
