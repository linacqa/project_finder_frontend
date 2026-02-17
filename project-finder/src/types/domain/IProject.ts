import { IDomainId } from "../IDomainId";

export interface IProject extends IDomainId {
	titleInEstonian: string;
	titleInEnglish: string;
	description: string;
}
