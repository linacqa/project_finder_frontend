import { IDomainId } from "../IDomainId";

export interface IFolder extends IDomainId {
	name: string;
	isVisible: boolean;
}
