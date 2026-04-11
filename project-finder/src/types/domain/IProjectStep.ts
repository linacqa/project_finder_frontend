import { IDomainId } from "../IDomainId";
import { IProject } from "./IProject";
import { IStep } from "./IStep";
import { IStepStatus } from "./IStepStatus";

export interface IProjectStep extends IDomainId {
	projectId: string,
	project: IProject | null,
	stepId: string,
	step: IStep | null,
	stepStatusId: string,
	stepStatus: IStepStatus | null,
	order: number,
}
