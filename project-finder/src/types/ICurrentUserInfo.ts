import { IDomainId } from "@/types/IDomainId";

export interface ICurrentUserInfo extends IDomainId {
	email: string;
	firstName: string;
	lastName: string;
	role: "admin" | "user" | "student" | "teacher";
}
